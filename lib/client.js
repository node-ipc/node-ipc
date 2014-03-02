var net         = require('net'),
    eventParser = require('../lib/eventParser.js'),
    pubsub      = require('event-pubsub');

function init(config,log){
    var client={
        config  : config,
        socket  : false,
        connect : connect,
        emit    : emit,
        log     : log,
        retryCount:0
    }
    new pubsub(client);
    
    return client;
}

function emit(type,data){
    this.log('dispatching event to '.debug, this.id.variable, this.path.variable,' : ', type.data,',', data);
    if(!data)
        data=false;
    this.socket.write(
        eventParser.format(
            {
                type:type,
                data:data
            }    
        )    
    );
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
        client.socket = net.connect(
            {
                path:client.path
            }
        );
    }else{
        client.log('Connecting client via TCP to'.debug, client.path.variable ,client.port);
        client.socket = net.connect(
            {
                port:client.port,
                host:client.path
            }
        );
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
        }
    );
    
    client.socket.on(
        'close',
        function(){
            client.log('connection closed'.notice ,client.id.variable , client.path.variable);
            
            if(client.config.stopRetrying || client.config.stopRetrying===0){
                if(client.retryCount++>client.config.stopRetrying){
                    client.log(client.config.id.variable,'exceeded connection rety amount of'.warn,client.config.stopRetrying);
                    client.socket.destroy();
                    return;
                }
            }
            
            client.isRetrying=true;
            
            setTimeout(
                (
                    function(client){
                        return function(){
                            client.isRetrying=false;
                            client.connect();
                            setTimeout(
                                function(){
                                    if(!client.isRetrying)
                                        client.retryCount=0;
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
            var events = eventParser.parse(data);
            var eCount = events.length;
            for(var i=0; i<eCount; i++){
                var e=JSON.parse(
                    events[i]
                );
                client.log('detected event of type '.debug, e.type.data,  e.data);
                client.trigger(
                   e.type,
                   e.data
                );
            }
        }
    );
}

module.exports=init;
