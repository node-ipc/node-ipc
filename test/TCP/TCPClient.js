import ipc from '../../node-ipc.js';
import process from 'process';

const dieAfter = 30e3;

function killClientProcess(){
    process.exit(0);
}


setTimeout(
    killClientProcess,
    dieAfter
);

ipc.config.id = 'tcpClient';
ipc.config.retry= 600;
ipc.config.silent=true;
ipc.config.networkPort=8500;


ipc.connectToNet(
    'testWorld',
    function(){
        ipc.of.testWorld.on(
            'connect',
            function(){
                ipc.of.testWorld.emit(
                    'message',
                    'hello'
                );
            }
        );

        ipc.of.testWorld.on(
            'END',
            killClientProcess
        )
    }
);

export {
    dieAfter as default,
    dieAfter
}