import ipc from '../../node-ipc.js';
import process from 'process';

const dieAfter = 30e3;

function killServerProcess(){
    process.exit(0);
}

//die after 60 seconds
setTimeout(
    killServerProcess,
    dieAfter
);

ipc.config.id = 'tcpServer';
ipc.config.retry= 1500;
ipc.config.networkPort=8300;
ipc.config.silent=true;

ipc.serveNet(
    function serverStarted(){
        ipc.server.on(
            'message',
            function gotMessage(data,socket){
                console.log('Server recieved message',data);

                if(data.message=="END"){
                    killServerProcess();
                }

                ipc.server.emit(
                    socket,
                    'message',
                    {
                        id      : ipc.config.id,
                        message : 'I am TCP server!'
                    }
                );
                console.log('server emitted data')
            }
        );

        console.log('TCP server up');
    }
);

ipc.server.start();

export {
    killServerProcess as default,
    killServerProcess
}