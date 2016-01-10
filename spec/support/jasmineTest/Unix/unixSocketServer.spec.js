'use strict';

const ipc = require('../../../../node-ipc');

ipc.config.id ='testWorld';
ipc.config.retry = 1000;
ipc.config.silent=false;

describe(
    'Test Cases for server: ',
    function testDescribe(){
        // Unix server verification //
        it(
            'Verify unix server detects only 1 client out of 2 clients and receives message.',
            function testIt(done){

                let clientCounter =0;
                ipc.config.maxConnections=1;
                ipc.config.networkPort='/tmp/app.testWorld';

                ipc.serve(
                    function serverStarted(){
                        ipc.server.on(
                            'message',
                            function gotMessage(data,socket){

                                clientCounter++;
                                expect(data.id).toBe('unixClient');
                                expect(data.message).toBe('I am unix client.');

                            }
                        );

                        const counterTimer=2000;

                        setTimeout(
                             function testTimer(){
                                 expect(clientCounter).toBe(1);

                                 done();
                             },
                             counterTimer
                        );
                    }
                );

                ipc.server.start();
            }
        );
    }
);
