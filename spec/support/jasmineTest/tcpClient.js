var ipc=require('../../../node-ipc');

ipc.config.id   = 'tcpClient';
ipc.config.retry= 600;


ipc.connectToNet(
    'tcpClient',
    8500,
    function(){
        ipc.of.tcpClient.on(
            'connect',
            function(){
              
                ipc.of.tcpClient.emit(
                    'app.message',
                    {
                        id      : ipc.config.id,
                        message : 'I am TCP client.'
                    }
                )
            }
        );
        ipc.of.tcpClient.on(
            'disconnect',
            function(){
                ipc.log('disconnected from world'.notice);
            }
        );
        ipc.of.tcpClient.on(
            'app.message',
            function(data){
                ipc.log('got a message from world : '.debug, data.message);
            }
        );

    }
);
