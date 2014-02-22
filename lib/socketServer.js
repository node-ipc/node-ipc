var net = require('net'),
    fs = require('fs'),
    eventParser = require('../lib/eventParser.js'),
    pubsub = require('event-pubsub');

function emit(socket, type, data){
    if(!data)
        data=false;
    console.log(type,data)
    this.log('dispatching event to socket'.debug, ' : ', type.data, data);
    
    socket.write(
        eventParser.format(
            {
                type:type,
                data:data
            }    
        )    
    );
};

function broadcast(type,data){
    this.log('broadcasting event to '.debug, this.path.variable,' : ', type.data, data);
    if(!data)
        data=false;
        
    var e=eventParser.format(
        {
            type:type,
            data:data
        }
    );
    
    for(var i=0, count=this.sockets.length; i<count; i++){
        this.sockets[i].write(e);
    }
};

function init(path,config,log){
    var server={
        config          : config,
        path            : path,
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
                console.log('Socket Server Path not specified, refusing to start'.warn);
                return;
            }
            
            fs.unlink(
                this.path, 
                (
                    function(server){
                        return function () {
                            server.log('starting server on '.debug,server.path.variable);
                            server.server=net.createServer(
                                function(socket) {
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
                                        function(data){
                                            data=eventParser.parse(data);
                                            
                                            while(data.length>0){
                                                var e=JSON.parse(data.shift());
                                                server.log('recieved event of : '.debug,e.type.data,e.data);
                                                
                                                server.sockets.push(socket);
                                                
                                                server.trigger(
                                                    e.type,
                                                    e.data,
                                                    socket
                                                );   
                                            }
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
                            );
                            
                            
                            server.server.listen(
                                server.path,
                                (
                                    function(server){
                                        return function(socket){
                                            server.onStart(socket)
                                        }
                                    }
                                )(server)
                            );
                            
                            server.server.maxConnections=server.maxConnections;
                            
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
                
                if(socket.readable)
                    continue;
                    
                server.log('Socket disconnected'.notice);
                
                socket.destroy();
                
                delete server.sockets[i];
                
                server.trigger(
                    'socket.disconnected'
                );
                
                return;
            }
        }    
    );    

    return server;
}

module.exports=init;