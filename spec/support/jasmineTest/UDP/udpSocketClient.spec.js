'use strict';

const ipc = require('../../../../node-ipc');

ipc.config.id ='testClient';
ipc.config.retry = 600;


describe(
    'UDP Socket verification.',
     function testDescription(){
         it(
            'Verify UDP server of type udp4 connects to UDP server named "udp4Server" and receives message.',
            function testIt(done){
                ipc.serveNet(
                    8001,
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

                        ipc.server.on(
                            'error',
                            function(err){
                                expect(err).toBe(false);
                                testDone();
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

                ipc.serveNet(
                    '::1',
                    8010,
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

                        ipc.server.on(
                            'error',
                            function(err){
                                expect(err).toBe(false);
                                testDone();
                            }
                        );
                    }
                );

                function testDone(){
                    ipc.server.stop();
                }

                ipc.server.start();
            }
        );
     }
);
