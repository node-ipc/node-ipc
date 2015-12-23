var ipc=require('../../../node-ipc');

/***************************************\
 * 
 * You should start both hello and world
 * then you will see them communicating.
 * 
 * *************************************/

ipc.config.id   = 'world';
ipc.config.retry= 1500;

var messages={
    goodbye:false,
    hello:false
}

ipc.serve(
    function(){
        ipc.server.on(
            'app.message',
            function(data,socket){
                ipc.log('got a message from'.debug, (data.id).variable, (data.message).data);
                messages[data.id]=true;
                ipc.server.emit(
                    socket,
                    'app.message',
                    {
                        id      : ipc.config.id,
                        message : data.message+' world!'
                    }
                );
                
                if(messages.hello && messages.goodbye){
                    ipc.log('got all required events, telling clients to kill connection'.good);
                    ipc.server.broadcast(
                        'kill.connection',
                        {
                            id:ipc.config.id
                        }
                    );
                }
            }
        );
    }
);




ipc.server.start();
