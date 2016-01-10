/*global describe, expect, it*/
'use strict';

const ipc = require('../../../../node-ipc');

describe(
    'Test Cases for server: ',
    function testDescribe(){
        // Unix server verification //
        it(
            'Verify unix server detects only 1 client out of 2 clients and receives message.',
            function testIt(done){

                ipc.config.id ='testWorld';
                ipc.config.retry = 1000;
                ipc.config.silent=false;

                let clientCounter=0;
                ipc.config.maxConnections=1;

                ipc.serve(
                    '/tmp/app.testWorld',
                    function serverStarted(){
                        ipc.server.on(
                            'connect',
                            function connected(){
                                clientCounter++;
                            }
                        );
                    }
                );

                setTimeout(
                     function clientCountDelay(){
                         expect(clientCounter).toBe(ipc.config.maxConnections);
                         ipc.server.stop();
                         done();
                     },
                     ipc.config.retry+ipc.config.retry
                );

                ipc.server.start();
            }
        );
    }
);
