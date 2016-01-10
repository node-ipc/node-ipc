const ipc=require('../../../node-ipc');
const process=require('process');
const dieAfter=30000;
const messageDelay=900;

//die after 60 seconds
setTimeout(
    function killServerProcess(){
        process.exit(0);
    },
    dieAfter
);

ipc.config.id = 'unixServerSync';
ipc.config.retry= 1500;
ipc.config.silent=true;

ipc.serve(
    function serverStarted(){
        ipc.server.on(
            'message',
            function gotMessage(data,socket){
                setTimeout(
                    function delayedMessage(){
                        ipc.server.emit(
                            socket,
                            'message',
                            {
                                id      : ipc.config.id,
                                message : 'Response from unix server'
                            }
                        );
                    },
                    messageDelay
                );
            }
        );
    }
);


ipc.server.start();
