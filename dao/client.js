'use strict';

const net = require('net'),
    tls = require('tls'),
    eventParser = require('./eventParser.js'),
    Pubsub = require('event-pubsub'),
    Message = require('js-message'),
    fs = require('fs'),
    Queue = require('js-queue');

function init(config,log){
    let client={
        config  : config,
        queue   : new Queue,
        socket  : false,
        connect : connect,
        emit    : emit,
        log     : log,
        retriesRemaining:config.maxRetries||0
    };

    new Pubsub(client);

    return client;
}

function emit(type,data){
    this.log('dispatching event to ', this.id, this.path, ' : ', type, ',', data);

    let message=new Message;
    message.type=type;
    message.data=data;

    if(this.config.rawBuffer){
        message=new Buffer(type,this.config.encoding);
    }else{
        message=eventParser.format(message);
    }

    if(!this.config.sync){
        this.socket.write(message);
        return;
    }

    this.queue.add(
        syncEmit.bind(this,message)
    );
}

function syncEmit(message){
    this.log('dispatching event to ', this.id, this.path, ' : ', message);
    this.socket.write(message);
}

function connect(){
    //init client object for scope persistance especially inside of socket events.
    let client=this;

    client.log('requested connection to ', client.id, client.path);
    if(!this.path){
        client.log('\n\n######\nerror: ', client.id ,' client has not specified socket path it wishes to connect to.');
        return;
    }

    if(!client.port){
        client.log('Connecting client on Unix Socket :', client.path);

        let path = client.path;

        if (process.platform ==='win32' && !client.path.startsWith('\\\\.\\pipe\\')){
            path = path.replace(/^\//, '');
            path = path.replace(/\//g, '-');
            path= `\\\\.\\pipe\\${path}`;
        }
        client.socket = net.connect(
            {
                path: path
            }
        );
    }else{
        if(!client.config.tls){
            client.log('Connecting client via TCP to', client.path ,client.port);
            client.socket = net.connect(
                {
                    port:client.port,
                    host:client.path
                }
            );
        }else{
            client.log('Connecting client via TLS to', client.path ,client.port,client.config.tls);
            if(client.config.tls.private){
                client.config.tls.key=fs.readFileSync(client.config.tls.private);
            }
            if(client.config.tls.public){
                client.config.tls.cert=fs.readFileSync(client.config.tls.public);
            }
            if(client.config.tls.trustedConnections){
                if(typeof client.config.tls.trustedConnections === 'string'){
                    client.config.tls.trustedConnections=[client.config.tls.trustedConnections];
                }
                client.config.tls.ca=[];
                for(let i=0; i<client.config.tls.trustedConnections.length; i++){
                    client.config.tls.ca.push(
                        fs.readFileSync(client.config.tls.trustedConnections[i])
                    );
                }
            }

            client.config.tls.host=client.path;
            client.config.tls.port=client.port;

            client.socket = tls.connect(
                client.config.tls
            );
        }
    }

    client.socket.setEncoding(this.config.encoding);

    client.socket.on(
        'error',
        function(err){
            client.log('\n\n######\nerror: ', err);
            client.trigger('error', err);

        }
    );

    client.socket.on(
        'connect',
        function connectionMade(){
            client.trigger('connect');
            client.retriesRemaining=client.config.maxRetries;
            client.log('retrying reset');
        }
    );

    client.socket.on(
        'close',
        function connectionClosed(){
            client.log('connection closed' ,client.id , client.path,
            client.retriesRemaining, 'tries remaining of', client.config.maxRetries
        );

            if(
                client.config.stopRetrying || client.retriesRemaining<1

            ){
                client.trigger('disconnect');
                client.log(
                    (client.config.id),
                    'exceeded connection rety amount of',
                    ' or stopRetrying flag set.'
                );

                client.socket.destroy();
                client.trigger('destroy');
                client=undefined;

                return;
            }

            setTimeout(
                function retryTimeout(){
                    client.retriesRemaining--;
                    client.connect();
                }.bind(null,client),
                client.config.retry
            );

            client.trigger('disconnect');
        }
    );

    client.socket.on(
        'data',
        function(data) {
            client.log('## recieved events ##');
            if(client.config.rawBuffer){
                client.trigger(
                   'data',
                   new Buffer(data,client.config.encoding)
                );
                if(!client.config.sync){
                    return;
                }

                client.queue.next();
                return;
            }

            if(!this.ipcBuffer){
                this.ipcBuffer='';
            }

            data=(this.ipcBuffer+=data);

            if(data.slice(-1)!=eventParser.delimiter || data.indexOf(eventParser.delimiter) == -1){
                client.log('Messages are large, You may want to consider smaller messages.');
                return;
            }

            this.ipcBuffer='';

            const events = eventParser.parse(data);
            const eCount = events.length;
            for(let i=0; i<eCount; i++){
                let message=new Message;
                message.load(events[i]);

                client.log('detected event', message.type, message.data);
                client.trigger(
                   message.type,
                   message.data
                );
            }

            if(!client.config.sync){
                return;
            }

            client.queue.next();
        }
    );
}

module.exports=init;
