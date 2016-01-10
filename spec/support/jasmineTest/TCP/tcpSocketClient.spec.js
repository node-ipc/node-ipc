'use strict';

const ipc = require('../../../../node-ipc');

ipc.config.id ='testClient';
ipc.config.retry = 600;

describe('TCP Socket verification of client',
         function(){

             it(
            'Verify retry attempts by TCP client to connect to the server as per the value set in "maxRetries" parameter.',
                function(done){

                    let tcpRetryAttempt = 3; //variable created to count the attempt made by client to connect to the server.
                    ipc.config.maxRetries = 3;
                    ipc.config.stopRetrying = false;

                    ipc.connectToNet(
                        'tcpFakeServer',
                         8002,
                         function(){

                             ipc.of.tcpFakeServer.on(
                                'disconnect',
                                function(){

                                    if(ipc.of.tcpFakeServer.retriesRemaining == 0){

                                        expect(tcpRetryAttempt).toBe(ipc.of.tcpFakeServer.retriesRemaining);
                                        expect(ipc.of.tcpFakeServer.socket.destroyed).toBe(true);


                                    }else if(ipc.of.tcpFakeServer.retriesRemaining < 0){

                                        expect(tcpRetryAttempt).not.toBeLessThan(0);
                                        expect(ipc.of.tcpFakeServer.retriesRemaining).not.toBeLessThan(0);


                                        ipc.of.tcpFakeServer.on(
                                                'error',
                                                function(err){
                                                    console.log('Error is: ', err);
                                                    ipc.disconnect('tcpFakeServer');
                                                }
                                            );

                                    }

                                    tcpRetryAttempt--;
                                }
                            );
                         }
                    );

            // Wait time is added to verify the fail case scenario of additional retry attempt by client than expected.
                    setTimeout(
                         function(){
                             ipc.disconnect('tcpFakeServer');
                             done();
                         },2500
                    );
                }
            );

             it(
                'Verify TCP client does not connect to the TCPserver when "stopRetrying" value is set to true.',
                    function(done){

                        let tcpRetryAttempt = 3; //variable created to count the attempt made by client to connect to the server.
                        ipc.config.maxRetries = 3;
                        ipc.config.stopRetrying = true;
                        ipc.config.silent=true;

                        ipc.connectToNet(
                            'tcpFakeServer',
                             8002,
                             function(){
                                 ipc.of.tcpFakeServer.on(
                                    'disconnect',
                                    function(){

                                        if(ipc.of.tcpFakeServer.retriesRemaining == 3){

                                            expect(tcpRetryAttempt).toBe(ipc.of.tcpFakeServer.retriesRemaining);
                                            expect(ipc.of.tcpFakeServer.socket.destroyed).toBe(true);

                                        }
                                            else if(ipc.of.tcpFakeServer.retriesRemaining < 3){

                                                expect(tcpRetryAttempt).not.toBeLessThan(3);
                                                expect(ipc.of.tcpFakeServer.retriesRemaining).not.toBeLessThan(3);


                                                ipc.of.tcpFakeServer.on(
                                                'error',
                                                function(err){
                                                    console.log('Error is: ', err);
                                                    ipc.disconnect('tcpFakeServer');
                                                }
                                            );

                                            }

                                        tcpRetryAttempt--;
                                    }
                                );
                             }
                        );

                // Wait time is added to verify the fail case scenario of additional retry attempt by client than expected.
                        setTimeout(
                             function(){
                                 ipc.disconnect('tcpFakeServer');
                                 done();
                             },700
                        );
                    }
            );

             it(
            'Verify TCP client connects to server named "tcpServer" and receives message.',
                    function(done){
                        ipc.connectToNet(
                            'tcpServer',
                            8300,
                            function(){
                                ipc.of.tcpServer.on(
                                    'connect',
                                    function(){

                                        ipc.of.tcpServer.emit(
                                            'message',
                                            {
                                                id      : ipc.config.id,
                                                message : 'Hello from testClient.'
                                            }
                                        );

                                        ipc.of.tcpServer.on(
                                            'message',
                                            function(data,socket){

                                                expect(data.id).toBe('tcpServer');
                                                expect(data.message).toBe('I am TCP server!');
                                                ipc.disconnect('tcpServer');
                                                done();
                                            }
                                        );

                                    }
                                );
                            }
                        );
                    }
          );

             it(
            'Verify TCP client queues the requests being sent to the server synchronously until it receives the response from server.',
                function(done){

                    ipc.config.sync = true;
                    let responseCounter = 0;

                    ipc.connectToNet(
                        'tcpServerSync',
                         8400,
                         function(){
                             ipc.of.tcpServerSync.on(
                                'connect',
                                function(){

                                    for(let i=0; i<5; i++){

                                        ipc.of.tcpServerSync.emit(
                                            'message',
                                            {
                                                id      : ipc.config.id,
                                                message : 'TCP Client Request '+ i

                                            }
                                        );
                                    }

                                    ipc.of.tcpServerSync.on(
                                        'message',
                                        function(data){
                                            if (data.message != null){
                                                responseCounter++;
                                                expect(data.message).toBe('Response from TCP server');
                                            }

                                            if (responseCounter == 5){
                                                expect(responseCounter).toBe(5);
                                                ipc.disconnect('tcpServerSync');
                                                done();
                                            }
                                        }
                                    );

                                    ipc.of.tcpServerSync.on(
                                            'error',
                                            function(err){
                                                console.log('Error is: ', err); done();
                                                ipc.disconnect('tcpServerSync');
                                            }
                                    );

                                }
                            );
                         }
                    );
                }
        );



         }
);
