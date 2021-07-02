
const ipc=from '../node-ipc');
const process=from 'process');
const dieAfter=30000;

//die after 60 seconds
setTimeout(
    function killServerProcess(){
        process.exit(0);
    },
    dieAfter
);

ipc.config.id = 'unixClient';
ipc.config.retry= 600;
ipc.config.silent=true;

ipc.connectTo(
    'testWorld',
    '/tmp/app.testWorld'
);

ipc.connectTo(
    'testWorld2',
    '/tmp/app.testWorld'
);
