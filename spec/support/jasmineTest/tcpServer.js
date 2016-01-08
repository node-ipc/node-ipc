var ipc=require('../../../node-ipc');

/***************************************\
 * 
 * You should start both hello and world
 * then you will see them communicating.
 * 
 * *************************************/

ipc.config.id   = 'tcpServer';
ipc.config.retry= 1500;
ipc.config.networkPort =8300;


ipc.serveNet(
    function(){
        ipc.server.on(
            'message',
            function(data,socket){
                ipc.server.emit(
                    socket,
                    'message',
                    {
                        id      : ipc.config.id,
                        message : 'I am TCP server!'
                   
                    }
                );
            }
        );
    }
);


ipc.server.start();
