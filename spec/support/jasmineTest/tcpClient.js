const ipc=require('../../../node-ipc');
const process=require('process');
const dieAfter=60000;

//die after 60 seconds
setTimeout(
    function killServerProcess(){
        process.exit(0);
    },
    dieAfter
);

ipc.config.id = 'tcpClient';
ipc.config.retry= 600;
ipc.config.silent=true;
ipc.config.networkPort=8500;


ipc.connectToNet(
    'tcpClient',
    function opened(){
        ipc.of.tcpClient.on(
            'connect',
            function connected(){
                ipc.of.tcpClient.emit(
                    'app.message',
                    {
                        id      : ipc.config.id,
                        message : 'I am TCP client.'
                    }
                );
            }
        );
    }
);
