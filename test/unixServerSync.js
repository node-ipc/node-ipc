
const ipc=from '../node-ipc');
const process=from 'process');
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
        let ready=false;

        ipc.server.on(
            'message',
            function gotMessage(data,socket){
                if(ready){
                    ipc.server.emit(
                        socket,
                        'message',
                        {
                            id      : ipc.config.id,
                            message : 'Error, client not wating for server response before sending request.'
                        }
                    );
                }
                ready=true;

                setTimeout(
                    function delayedMessage(){
                        ready=false;
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
