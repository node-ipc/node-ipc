'use strict';

const ipc = require('../../../../node-ipc');

describe('TCP Socket verification of server',
    function TCPSocketSpec(){
        it(
            'Verify TCP server detects only 1 client out of 2 clients and receives message.',
            function(done){
                ipc.config.id ='testWorld';
                ipc.config.retry = 1000;
                
                let clientCounter=0;
                ipc.config.maxConnections=1;
                ipc.config.networkPort=8500;

                ipc.serveNet(
                    function(){
                        ipc.server.on(
                            'connect',
                            function(data,socket){
                                clientCounter++;
                            }
                        );
                    }
                );

                setTimeout(
                     function(){
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
