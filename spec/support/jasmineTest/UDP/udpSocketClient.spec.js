'use strict';

const ipc = require('../../../../node-ipc');

describe(
    'UDP Socket verification.',
     function testDescription(){
         it(
            'Verify UDP server of type udp4 connects to UDP server named "udp4Server" and receives message.',
            function testIt(done){
                ipc.config.networkPort=8095;
                ipc.config.id ='testClient';
                ipc.config.retry = 600;

                let clientPort=8001;

                ipc.serveNet(
                    clientPort,
                    'udp4',
                    function serverStarted(){
                        ipc.server.on(
                            'message',
                            function gotMessage(data,socket){
                                expect(data.id).toBe('udpServer');
                                expect(data.message).toBe('I am UDP4 server!');
                                testDone();
                            }
                        );

                        ipc.server.on(
                            'error',
                            function(err){
                                expect(err).toBe(false);
                                testDone();
                            }
                        );

                        ipc.server.emit(
                            {
                                address : 'localhost',
                                port    : ipc.config.networkPort
                            },
                            'message',
                            {
                                id      : ipc.config.id,
                                message : 'I am testClient'
                            }
                        );
                    }
                );

                function testDone(){
                    ipc.server.stop();
                    done();
                }

                ipc.server.start();
            }
        );

         it(
            'Verify UDP server of type udp6 connects to UDP server named "udp6Server" and receives message.',
            function(done){
                ipc.config.networkPort=8099;
                ipc.config.id ='testClient';
                ipc.config.retry = 600;

                let clientPort=8010;

                ipc.serveNet(
                    '::1',
                    clientPort,
                    'udp6',
                    function(){
                        ipc.server.on(
                            'message',
                            function(data,socket){
                                expect(data.id).toBe('udp6Server');
                                expect(data.message).toBe('I am UDP6 server!');
                                testDone();
                            }
                        );

                        ipc.server.on(
                            'error',
                            function(err){
                                expect(err).toBe(false);
                                testDone();
                            }
                        );

                        ipc.server.emit(
                            {
                                address : '::1',
                                port    : ipc.config.networkPort
                            },
                            'message',
                            {
                                id      : ipc.config.id,
                                message : 'I am testClient'
                            }
                        );
                    }
                );

                function testDone(){
                    ipc.server.stop();
                    done();
                }

                ipc.server.start();
            }
        );
     }
);
