/*global describe, expect, it*/
'use strict';

const ipc = require('../../../../node-ipc');

ipc.config.id ='testClient';
ipc.config.retry = 60;

describe('Test Cases for Unix client: ',
    function UnixClientSpec(){
        it(
            'Verify retry attempts by Unix client to connect to the Unix server as per the value set in "maxRetries" parameter.',
            function testIt(done){

                ipc.config.maxRetries = 3;

                //set to -1 because there is an error on the first fail
                //before retrying
                let errorCount=-1;

                ipc.connectTo(
                    'fakeworld',
                    function open(){
                        ipc.of.fakeworld.on(
                            'error',
                            function gotError(err){
                                errorCount++;
                                expect(ipc.of.fakeworld.retriesRemaining).toBe(
                                    ipc.config.maxRetries-errorCount
                                );
                                expect(err).toBeDefined();
                            }
                        );
                    }
                );

                setTimeout(
                    function testDelay(){
                        expect(errorCount).toBe(ipc.config.maxRetries);
                        ipc.disconnect('fakeworld');
                        done();
                    },
                    ipc.config.retry*ipc.config.maxRetries +
                    ipc.config.retry+ipc.config.retry
                );
            }
        );

        it(
            'Verify Unix client does not connect to the unix server when "stopRetrying" value is set to true.',
            function testIt(done){

                ipc.config.maxRetries = 3;
                ipc.config.stopRetrying = true;
                ipc.silent=true;

                //set to -1 because there is an error on the first fail
                //before retrying
                let errorCount=-1;

                ipc.connectTo(
                    'fakeworld',
                    function open(){

                        ipc.of.fakeworld.on(
                            'error',
                            function gotError(err){
                                expect(ipc.of.fakeworld.retriesRemaining).toBe(ipc.config.maxRetries);
                                errorCount++;
                                expect(err).toBeDefined();
                            }
                        );
                    }
                );

                setTimeout(
                    function testDelay(){
                        expect(errorCount).toBe(0);
                        expect(ipc.of.fakeworld.retriesRemaining).toBe(ipc.config.maxRetries);
                        ipc.disconnect('fakeworld');
                        done();
                    },
                    ipc.config.retry*ipc.config.maxRetries
                );
            }
        );


        it(
            'Verify unix client connects to "unixServer" and receives message.',
            function testIt(done){
                ipc.connectTo(
                    'unixServer',
                    '/tmp/app.unixServer',
                     function open(){
                         ipc.of.unixServer.on(
                            'connect',
                            function connected(){
                                ipc.of.unixServer.on(
                                    'message',
                                    function gotMessage(data){
                                        expect(data.id).toBe('unixServer');
                                        expect(data.message).toBe('I am unix server!');
                                        testDone();
                                    }
                                );

                                ipc.of.unixServer.on(
                                    'error',
                                    function gotErr(err){
                                        expect(err).toBe(false);
                                        testDone();
                                    }
                                );

                                ipc.of.unixServer.emit(
                                    'message',
                                    {
                                        id      : ipc.config.id,
                                        message : 'Hello from Client.'
                                    }
                                );
                            }
                        );
                     }
                );

                function testDone(){
                    ipc.disconnect('unixServer');
                    done();
                }
            }
        );

        it(
            'Verify unix client queues the requests being sent to the server synchronously until it receives the response from server.',
            function testIt(done){

                ipc.config.sync = true;
                let responseCounter = 0;

                ipc.connectTo(
                    'unixServerSync',
                    '/tmp/app.unixServerSync',
                     function open(){
                         ipc.of.unixServerSync.on(
                            'connect',
                            function connected(){

                                for(let i=0; i<5; i++){
                                    ipc.of.unixServerSync.emit(
                                        'message',
                                        {
                                            id      : ipc.config.id,
                                            message : 'Unix Client Request '
                                        }
                                    );
                                }

                                ipc.of.unixServerSync.on(
                                    'message',
                                    function gotMessage(data){
                                        expect(data.message).toBe('Response from unix server');
                                        responseCounter++;

                                        if (responseCounter < 5){
                                            return;
                                        }
                                        expect(responseCounter).toBe(5);
                                        testDone();
                                    }
                                );

                                ipc.of.unixServerSync.on(
                                    'error',
                                    function testError(err){
                                        expect(err).toBe(false);
                                        testDone();
                                    }
                                );
                            }
                        );
                     }
                );

                function testDone(){
                    ipc.disconnect('unixServerSync');
                    done();
                }
            }
        );
    }
);
