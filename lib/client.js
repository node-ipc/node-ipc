var net         = require('net'),
    tls         = require('tls'),
    eventParser = require('../lib/eventParser.js'),
    pubsub      = require('event-pubsub'),
    Message     = require('js-message'),
    fs          = require('fs');

function init(config,log){
    var client={
        config  : config,
        socket  : false,
        connect : connect,
        emit    : emit,
        log     : log,
        retriesRemaining:config.maxRetries||0
    }
    new pubsub(client);

    return client;
}

function emit(type,data){
    this.log('dispatching event to '.debug, this.id.variable, this.path.variable,' : ', type.data,',', data);

    var message=new Message;
    message.type=type;
    message.data=data;

    if(this.config.rawBuffer){
        message=new Buffer(type,this.encoding);
    }else{
        message=eventParser.format(message);
    }

    this.socket.write(message);
};

function connect(){
    //init client object for scope persistance especially inside of socket events.
    var client=this;

    client.log('requested connection to '.debug, client.id.variable, client.path.variable);
    if(!this.path){
        client.log('\n\n######\nerror: '.error, client.id .info,' client has not specified socket path it wishes to connect to.'.error);
        return;
    }

    if(!client.port){
        client.log('Connecting client on Unix Socket :'.debug, client.path.variable);
        if (process.platform ==='win32'){
            client.path = client.path.replace(/^\//, '');
            client.path = client.path.replace(/\//g, '-');
            client.path= '\\\\.\\pipe\\'+client.path;
        }
        client.socket = net.connect(
            {
                path:client.path
            }
        );
    }else{
        if(!client.config.tls){
            client.log('Connecting client via TCP to'.debug, client.path.variable ,client.port);
            client.socket = net.connect(
                {
                    port:client.port,
                    host:client.path
                }
            );
        }else{
            client.log('Connecting client via TLS to'.debug, client.path.variable ,client.port,client.config.tls);
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
                for(var i=0; i<client.config.tls.trustedConnections.length; i++){
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
            client.log('\n\n######\nerror: '.error, err);
        }
    );

    client.socket.on(
        'connect',
        function(){
            client.trigger('connect');
            client.retriesRemaining=client.config.maxRetries;
            client.log('retrying reset')
        }
    );

    client.socket.on(
        'close',
        function(){
            client.log('connection closed'.notice ,client.id.variable , client.path.variable, client.retriesRemaining+' tries remaining of '+client.config.maxRetries);

            if(
                client.config.stopRetrying || client.retriesRemaining<1

            ){
                client.log(
                    client.config.id.variable,
                    'exceeded connection rety amount of'.warn,
                    " or stopRetrying flag set."
                );

                client.socket.destroy();
                client=undefined;

                return;
            }

            client.isRetrying=true;

            setTimeout(
                (
                    function(client){
                        return function(){
                            client.retriesRemaining--;
                            client.isRetrying=false;
                            client.connect();
                            setTimeout(
                                function(){
                                    if(!client.isRetrying)
                                        client.retriesRemaining=client.config.maxRetries;
                                },
                                100
                            )
                        }
                    }
                )(client),
                client.config.retry
            );

            client.trigger('disconnect');
        }
    );

    client.socket.on(
        'data',
        function(data) {
            client.log('## recieved events ##'.rainbow);
            if(client.config.rawBuffer){
                client.trigger(
                   'data',
                   new Buffer(data,this.encoding)
                );
                return;
            }

            if(!this.ipcBuffer)
                this.ipcBuffer='';

            data=(this.ipcBuffer+=data);

            if(data.slice(-1)!=eventParser.delimiter || data.indexOf(eventParser.delimiter) == -1){
                client.log('Implementing larger buffer for this socket message. You may want to consider smaller messages'.notice);
                return;
            }

            this.ipcBuffer='';

            var events = eventParser.parse(data);
            var eCount = events.length;
            for(var i=0; i<eCount; i++){
                var message=new Message;
                message.load(events[i]);

                client.log('detected event of type '.debug, message.type.data,  message.data);
                client.trigger(
                   message.type,
                   message.data
                );
            }
        }
    );
}

module.exports=init;
