var net     = require('net'),
    fs      = require('fs'),
    dgram   = require('dgram'),
    eventParser = require('../lib/eventParser.js'),
    pubsub  = require('event-pubsub');

function emit(socket, type, data){
    if(!data)
        data=false;
    this.log('dispatching event to socket'.debug, ' : ', type.data, data);
    
    var event={
        type:type,
        data:data
    }
    
    if(this.udp4 || this.udp6){
        
        if(!socket.address || !socket.port){
            this.log('Attempting to emit to a single UDP socket without supplying socket address or port. Redispatching event as broadcast to all connected sockets');
            this.broadcast(type,data);
            return;
        }
        
        this.server.write(
            eventParser.format(
                event
            ),
            socket
        )
        return;
    };
    
    socket.write(
        eventParser.format(
            event   
        )    
    );
};

function broadcast(type,data){
    this.log('broadcasting event to all known sockets listening to '.debug, this.path.variable,' : ', ((this.port)?this.port:''),  type, data);
    if(!data)
        data=false;
        
    var e=eventParser.format(
        {
            type:type,
            data:data
        }
    );
    
    if(this.udp4 || this.udp6){
        for(var i=0, count=this.sockets.length; i<count; i++){
            this.server.write(e,this.sockets[i]);
        }
    }else{
        for(var i=0, count=this.sockets.length; i<count; i++){
            this.sockets[i].write(e);
        }
    }
};

function init(path,config,log,port){
    var server={
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
        define          : {
            listen      : {
                'get.events.broadcasting'   : 'does not require any special paramaters',
                'get.events.listening'      : 'does not require any special paramaters'
            },
            broadcast   : {
                'events.broadcasting'   : 'data.events is a JSON object of event definitions by type '+config.id+' will broadcast on '+path,
                'events.listening'      : 'data.events is a JSON object of event definitions by type '+config.id+' is listening for on '+path   
            }
        },
        onStart         : function(socket){
            this.trigger(
                'start',
                socket
            );
        },
        start           : function(){
            if(!this.path){
                server.log('Socket Server Path not specified, refusing to start'.warn);
                return;
            }
            
            fs.unlink(
                this.path, 
                (
                    function(server){
                        return function () {
                            server.log('starting server on '.debug,server.path.variable,((server.port)?':'+server.port:'').variable);
                            
                            if(!server.udp4 && !server.udp6){
                                server.server=net.createServer(
                                    serverCreated
                                );
                            }else{
                                function UDPWrite(message,socket){
                                    var data=new Buffer(message, server.config.encoding);
                                    server.server.send(
                                        data, 
                                        0, 
                                        data.length, 
                                        socket.port, 
                                        socket.address, 
                                        function(err, bytes) {
                                            if(err){
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
                                        serverCreated(server.server)
                                    }
                                );
                            }
                            
                            function serverCreated(socket) {
                                server.sockets.push(socket);
                                
                                if(socket.setEncoding)
                                    socket.setEncoding(server.config.encoding);
                                    
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
                                        server.trigger('error',err);
                                    }
                                );
                                
                                socket.on(
                                    'data',
                                    function(data,UDPSocket){
                                        if(!this.ipcBuffer)
                                            this.ipcBuffer='';
                                            
                                        data=(this.ipcBuffer+=data);
                                        
                                        if(data.slice(-1)!=eventParser.delimiter){
                                            server.log('Socket buffer size exceeded, consider smaller messages or a larger buffer.'.warn, 'Implementing software buffer expansion for this message.'.notice);
                                            return;
                                        }
                                        
                                        this.ipcBuffer='';
                                        
                                        data=eventParser.parse(data);
                                        var sock=((server.udp4 || server.udp6)? UDPSocket : socket);
                                        
                                        while(data.length>0){
                                            var e=JSON.parse(data.shift());
                                            server.log('received event of : '.debug,e.type.data,e.data);
                                            
                                            server.trigger(
                                                e.type,
                                                e.data,
                                                sock
                                            );   
                                        }
                                    }
                                );
                                
                                socket.on(
                                    'message',
                                    function(msg,rinfo) {
                                        if (!rinfo)
                                            return;
                                        server.log('Received UDP message from '.debug, rinfo.address.variable, rinfo.port);
                                        socket.emit('data',msg.toString(),rinfo);
                                    }
                                );
                                
                                server.trigger(
                                    'connect',
                                    socket
                                );
                                
                                server.trigger(
                                    'get.events.broadcasting',
                                    socket
                                );
                                
                                server.trigger(
                                    'get.events.listening',
                                    socket
                                );
                            }
                            
                            function started(socket){
                                server.onStart(socket)
                            }
                            
                            if(!port){
                                server.log('starting server as'.debug, 'Unix Socket'.variable);
                                server.server.listen(
                                    server.path,
                                    started
                                );
                                
                                server.server.maxConnections=server.maxConnections;
                                return;
                            }
                            
                            if(!server.udp4 && !server.udp4){
                                server.log('starting server as'.debug, 'TCP'.variable);
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
                    }
                )(this)
            );
        }
    };
    
    new pubsub(server);
    
    server.on(
        'get.events.broadcasting',
        function(socket){
            server.emit(
                socket,
                'events.broadcasting',
                {
                    id      : server.config.id,
                    events  : server.define.broadcast
                }
            );
        }
    );
    
    server.on(
        'get.events.listening',
        function(socket){
            server.emit(
                socket,
                'events.listening',
                {
                    id      : server.config.id,
                    events  : server.define.listen,
                }
            );
        }
    )        
    
    server.on(
        'close',   
        function(){
            for(var i=0, count=server.sockets.length; i<count; i++){
                var socket=server.sockets[i];
                
                if(socket){
                    if(socket.readable) 
                        continue;    
                }
                    
                server.log('socket disconnected'.notice);

                if(socket)
                    socket.destroy();
                
                server.sockets.splice(i,1);

                server.trigger('socket.disconnected', socket);

                return;
            }
        }    
    );    

    return server;
}

module.exports=init;
