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

ipc.config.id = 'unixServer';
ipc.config.retry= 1500;
ipc.config.silent=true;

ipc.serve(
    function serverStarted(){
        ipc.server.on(
            'message',
            function gotMessage(data,socket){
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
