var ipc=require('../../../node-ipc');

/***************************************\
 * 
 * You should start both hello and world
 * then you will see them communicating.
 * 
 * *************************************/

ipc.config.id   = 'rawBufferWorldAscii';
ipc.config.retry= 1500;

ipc.config.rawBuffer=true;
ipc.config.encoding='hex';



ipc.serveNet(
    function(){
        ipc.server.on(
            'connect',
            function(socket){
                ipc.server.emit(
                    socket,
                    [0x10,0x0A,0x01]
                    //'hello'
                );
            }
        );
        
        

    }
);


ipc.server.start();


