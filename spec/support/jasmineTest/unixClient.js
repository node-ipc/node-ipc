'use strict';

const ipc=require('../../../node-ipc');
const process=require('process');
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
    '/tmp/app.testWorld',
    function opened(){
        ipc.of.testWorld.on(
            'connect',
            function connected(){
                ipc.of.testWorld.emit(
                    'message',
                    {
                        id      : ipc.config.id,
                        message : 'I am unix client.'
                    }
                );
            }
        );
    }
);
