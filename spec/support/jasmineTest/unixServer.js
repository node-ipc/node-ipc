var ipc=require('../../../node-ipc');

/***************************************\
 * 
 * You should start both hello and world
 * then you will see them communicating.
 * 
 * *************************************/

ipc.config.id   = 'unixServer';
ipc.config.retry= 1500;

ipc.serve(
    function(){
        ipc.server.on(
            'message',
            function(data,socket){
              
                ipc.server.emit(
                    socket,
                    'message',
                    {
                        id      : ipc.config.id,
                        message : 'I am unix server!'
                        
                    }
                );
            }
        );
    }
);


ipc.server.start();
