var ipc=require('../../../node-ipc');

/***************************************\
 * 
 * You should start both hello and world
 * then you will see them communicating.
 * 
 * *************************************/

ipc.config.id   = 'tcpServerSync';
ipc.config.retry= 1500;
ipc.config.networkPort = 8400;


ipc.serveNet(
    function(){
        ipc.server.on(
            'message',
            function(data,socket){
               setTimeout(
                   function(){
                        ipc.server.emit(
                            socket,
                            'message',
                            {
                                id      : ipc.config.id,
                                message : 'Response from TCP server'

                            }
                        );
                    },900
                );
            }
        );
    }
);


ipc.server.start();
