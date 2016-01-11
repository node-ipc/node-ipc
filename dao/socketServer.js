'use strict';

const net = require('net'),
    tls = require('tls'),
    fs = require('fs'),
    dgram = require('dgram'),
    eventParser = require('./eventParser.js'),
    Pubsub = require('event-pubsub'),
    Message = require('js-message');

function emit(socket, type, data){
    this.log('dispatching event to socket'.debug, ' : ', type.data, data);

    let message=new Message;
    message.type=type;
    message.data=data;

    if(this.config.rawBuffer){
        message=new Buffer(type,this.encoding);
    }else{
        message=eventParser.format(message);
    }

    if(this.udp4 || this.udp6){

        if(!socket.address || !socket.port){
            this.log('Attempting to emit to a single UDP socket without supplying socket address or port. Redispatching event as broadcast to all connected sockets');
            this.broadcast(type,data);
            return;
        }

        this.server.write(
            message,
            socket
        );
        return;
    }

    socket.write(message);
}

function broadcast(type,data){
    this.log('broadcasting event to all known sockets listening to '.debug, this.path.variable,' : ', ((this.port)?this.port:''), type, data);
    let message=new Message;
    message.type=type;
    message.data=data;

    if(this.config.rawBuffer){
        message=new Buffer(type,this.encoding);
    }else{
        message=eventParser.format(message);
    }

    if(this.udp4 || this.udp6){
        for(let i=1, count=this.sockets.length; i<count; i++){
            this.server.write(message,this.sockets[i]);
        }
    }else{
        for(let i=0, count=this.sockets.length; i<count; i++){
            this.sockets[i].write(message);
        }
    }
}

function init(path,config,log,port){
    let server={
        config          : config,
        path            : path,
        port            : port,
        udp4            : false,
        udp6            : false,
        log             : log,
        server          : false,
        sockets         : [],
        emit            : emit,
        broadcast       : broadcast,
        onStart         : function onStart(socket){
            this.trigger(
                'start',
                socket
            );
        },
        stop:function stop(){
            server.server.close();
        },
        start           : function start(){
            if(!this.path){
                server.log('Socket Server Path not specified, refusing to start'.warn);
                return;
            }

            fs.unlink(
                this.path,
                function () {
                    server.log(
                        'starting server on '.debug,server.path.variable,
                        ((server.port)?`:${server.port}`:'').variable
                    );

                    if(!server.udp4 && !server.udp6){
                        if(!server.config.tls){
                            server.server=net.createServer(
                                serverCreated
                            );
                        }else{
                            server.log('starting TLS server'.debug,server.config.tls);
                            if(server.config.tls.private){
                                server.config.tls.key=fs.readFileSync(server.config.tls.private);
                            }else{
                                server.config.tls.key=fs.readFileSync(`${__dirname}/../local-node-ipc-certs/private/server.key`);
                            }
                            if(server.config.tls.public){
                                server.config.tls.cert=fs.readFileSync(server.config.tls.public);
                            }else{
                                server.config.tls.cert=fs.readFileSync(`${__dirname}/../local-node-ipc-certs/server.pub`);
                            }
                            if(server.config.tls.dhparam){
                                server.config.tls.dhparam=fs.readFileSync(server.config.tls.dhparam);
                            }
                            if(server.config.tls.trustedConnections){
                                if(typeof server.config.tls.trustedConnections === 'string'){
                                    server.config.tls.trustedConnections=[server.config.tls.trustedConnections];
                                }
                                server.config.tls.ca=[];
                                for(let i=0; i<server.config.tls.trustedConnections.length; i++){
                                    server.config.tls.ca.push(
                                        fs.readFileSync(server.config.tls.trustedConnections[i])
                                    );
                                }
                            }
                            server.server=tls.createServer(
                                server.config.tls,
                                serverCreated
                            );
                        }
                    }else{
                        function UDPWrite(message,socket){
                            let data=new Buffer(message, server.config.encoding);
                            server.server.send(
                                data,
                                0,
                                data.length,
                                socket.port,
                                socket.address,
                                function(err, bytes) {
                                    if(err){
                                        server.log('error writing data to socket'.warn,err);
                                        server.trigger(
                                            'error',
                                            function(err){
                                                server.trigger('error',err);
                                            }
                                        );
                                    }
                                }
                            );
                        }

                        server.server=dgram.createSocket(
                            ((server.udp4)? 'udp4':'udp6')
                        );
                        server.server.write=UDPWrite;
                        server.server.on(
                            'listening',
                            function () {
                                serverCreated(server.server);
                            }
                        );
                    }

                    server.server.on(
                        'error',
                        function(err){
                            server.log('server error'.warn,err);

                            server.trigger(
                                'error',
                                err
                            );
                        }
                    );

                    server.server.maxConnections=server.config.maxConnections;

                    function serverCreated(socket) {
                        server.sockets.push(socket);

                        if(socket.setEncoding){
                            socket.setEncoding(server.config.encoding);
                        }

                        server.log('## socket connection to server detected ##'.rainbow);
                        socket.on(
                            'close',
                            function(socket){
                                server.trigger(
                                    'close',
                                    socket
                                );
                            }
                        );

                        socket.on(
                            'error',
                            function(err){
                                server.log('server socket error'.warn,err);

                                server.trigger('error',err);
                            }
                        );

                        socket.on(
                            'data',
                            function(data,UDPSocket){
                                let sock=((server.udp4 || server.udp6)? UDPSocket : socket);
                                if(server.config.rawBuffer){
                                    data=new Buffer(data,this.encoding);
                                    server.trigger(
                                        'data',
                                        data,
                                        sock
                                    );
                                    return;
                                }

                                if(!this.ipcBuffer){
                                    this.ipcBuffer='';
                                }

                                data=(this.ipcBuffer+=data);

                                if(data.slice(-1)!=eventParser.delimiter || data.indexOf(eventParser.delimiter) == -1){
                                    server.log('Implementing larger buffer for this socket message. You may want to consider smaller messages'.notice);
                                    return;
                                }

                                this.ipcBuffer='';

                                data=eventParser.parse(data);

                                while(data.length>0){
                                    let message=new Message;
                                    message.load(data.shift());

                                    server.log('received event of : '.debug,message.type.data,message.data);

                                    if(message.data.id){
                                        sock.id=message.data.id;
                                    }
                                    
                                    server.trigger(
                                        message.type,
                                        message.data,
                                        sock
                                    );
                                }
                            }
                        );

                        socket.on(
                            'message',
                            function(msg,rinfo) {
                                if (!rinfo){
                                    return;
                                }

                                server.log('Received UDP message from '.debug, rinfo.address.variable, rinfo.port);
                                let data;

                                if(server.config.rawSocket){
                                    data=new Buffer(msg,this.encoding);
                                }else{
                                    data=msg.toString();
                                }
                                socket.emit('data',data,rinfo);
                            }
                        );

                        server.trigger(
                            'connect',
                            socket
                        );

                        if(server.config.rawBuffer){
                            return;
                        }
                    }

                    function started(socket){
                        server.onStart(socket);
                    }

                    if(!port){
                        server.log('starting server as'.debug, 'Unix || Windows Socket'.variable);
                        if (process.platform ==='win32'){
                            server.path = server.path.replace(/^\//, '');
                            server.path = server.path.replace(/\//g, '-');
                            server.path= `\\\\.\\pipe\\${server.path}`;
                        }

                        server.server.listen(
                            server.path,
                            started
                        );

                        return;
                    }

                    if(!server.udp4 && !server.udp6){
                        server.log('starting server as'.debug, (server.config.tls?'TLS':'TCP').variable);
                        server.server.listen(
                            server.port,
                            server.path,
                            started
                        );
                        return;
                    }

                    server.log('starting server as'.debug,((server.udp4)? 'udp4':'udp6').variable);
                    server.server.bind(
                        server.port,
                        server.path
                    );

                    started(
                        {
                            address : server.path,
                            port    : server.port
                        }
                    );
                }
            );
        }
    };

    new Pubsub(server);

    server.on(
        'close',
        function(){
            for(let i=0, count=server.sockets.length; i<count; i++){
                let socket=server.sockets[i];
                let destroyedSocketId=false;

                if(socket){
                    if(socket.readable){
                        continue;
                    }
                }

                if(socket.id){
                    destroyedSocketId=socket.id;
                }

                server.log('socket disconnected'.notice,destroyedSocketId.toString().variable);

                if(socket && socket.destroy){
                    socket.destroy();
                }

                server.sockets.splice(i,1);

                server.trigger('socket.disconnected', socket, destroyedSocketId);

                return;
            }
        }
    );

    return server;
}

module.exports=init;
