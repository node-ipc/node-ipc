var ipc = require('../../../../node-ipc');
    
    ipc.config.id ='testClient';
    ipc.config.retry = 600;
    

describe('Test Cases for Unix client: ',
         function(){
         
            it(
                'Verify retry attempts by Unix client to connect to the Unix server as per the value set in "maxRetries" parameter.',
                function(done){
                    
                    var retryAttempt = 3; //variable created to count the attempt made by client to connect to the server.
                    ipc.config.maxRetries = 3;
                    ipc.config.silent= true;

                    ipc.connectTo(
                        'fakeworld',
                         function(){
                            
                             ipc.of.fakeworld.on(
                                'disconnect',
                                function(){
                                    
                                    if(ipc.of.fakeworld.retriesRemaining == 0){
                                        
                                        expect(retryAttempt).toBe(ipc.of.fakeworld.retriesRemaining);
                                        expect(ipc.of.fakeworld.socket.destroyed).toBe(true);
                                        
                                    }
                                        else if(ipc.of.fakeworld.retriesRemaining < 0){
                                        
                                        expect(retryAttempt).not.toBeLessThan(0);
                                        expect(ipc.of.fakeworld.retriesRemaining).not.toBeLessThan(0);
                                            
                                            
                                        ipc.of.fakeworld.on(
                                            'error',
                                            function(err){
                                                console.log('Error is: ', err);
                                                ipc.disconnect('fakeworld');
                                            }
                                        ); 
                                            
                                    }
                                        
                                     retryAttempt--;   
                                }
                            );
                         }
                    );
                    
            // Wait time is added to verify the fail case scenario of additional retry attempt by client than expected.
                    setTimeout(
                         function(){
                             ipc.disconnect('fakeworld');
                             done();
                         },2500
                    );
                     

                }
            );
     
        it(
                'Verify Unix client does not connect to the unix server when "stopRetrying" value is set to true.',
                function(done){
                    
                    var retryAttempt = 3; //variable created to count the attempt made by client to connect to the server.
                    ipc.config.maxRetries = 3;
                    ipc.config.stopRetrying = true;
                    
                    
                    ipc.connectTo(
                        'fakeworld',
                         function(){
                             ipc.of.fakeworld.on(
                                'disconnect',
                                function(){
                                    
                                    if(ipc.of.fakeworld.retriesRemaining == 3){
                                        
                                        expect(retryAttempt).toBe(ipc.of.fakeworld.retriesRemaining);
                                        expect(ipc.of.fakeworld.socket.destroyed).toBe(true);
                                        
                                    }
                                        else if(ipc.of.fakeworld.retriesRemaining < 3){
                                        
                                        expect(retryAttempt).not.toBeLessThan(3);
                                        expect(ipc.of.fakeworld.retriesRemaining).not.toBeLessThan(3);
                                            
                                            
                                        ipc.of.fakeworld.on(
                                            'error',
                                            function(err){
                                                console.log('Error is: ', err);
                                                ipc.disconnect('fakeworld');
                                            }
                                        ); 
                                            
                                    }
                                        
                                     retryAttempt--;   
                                }
                            );
                         }
                    );
                    
            // Wait time is added to verify the fail case scenario of additional retry attempt by client than expected.
                    setTimeout(
                         function(){
                             ipc.disconnect('fakeworld');
                             done();
                         },700
                    );
                }
            );
   
       
        it(
                'Verify unix client connects to "unixServer" and receives message.',
                function(done){
                    ipc.connectTo(
                        'unixServer',
                        '/tmp/app.unixServer',
                         function(){
                            ipc.of.unixServer.on(
                                'connect',
                                function(){
                                    ipc.of.unixServer.emit(
                                        'message',
                                        {
                                            id      : ipc.config.id,
                                            message : 'Hello from Client.'
                                        }
                                    );
                                    
                                    ipc.of.unixServer.on(
                                        'message',
                                        function(data){
                                            
                                            expect(data.id).toBe('unixServer');
                                            expect(data.message).toBe('I am unix server!');
                                            ipc.disconnect('unixServer');
                                            done();
                                        }
                                    );
                                    
                                    ipc.of.unixServer.on(
                                            'error',
                                            function(err){
                                                console.log('Error is: ', err); done();
                                                ipc.disconnect('unixServer');
                                            }
                                    );
                                    
                                }
                            );
                         }
                    );
                }
        );
    
        it(
            'Verify unix client queues the requests being sent to the server synchronously until it receives the response from server.',
                function(done){
            
                    ipc.config.sync = true;
                    var responseCounter = 0;
            
                    ipc.connectTo(
                        'unixServerSync',
                        '/tmp/app.unixServerSync',
                         function(){
                            ipc.of.unixServerSync.on(
                                'connect',
                                function(){
                                    
                                    for(var i=0; i<5; i++){
                                        
                                        ipc.of.unixServerSync.emit(
                                            'message',
                                            {
                                                id      : ipc.config.id,
                                                message : 'Unix Client Request '+ i
                                                
                                            }
                                        );
                                    }
                                    
                                    ipc.of.unixServerSync.on(
                                        'message',
                                        function(data){
                                              if (data.message != null){
                                                responseCounter++; 
                                                expect(data.message).toBe('Response from unix server');
                                              }
                                            
                                            if (responseCounter == 5){
                                                expect(responseCounter).toBe(5);
                                                ipc.disconnect('unixServerSync');
                                                done();
                                            }
                                        }
                                    );
                                    
                                    ipc.of.unixServerSync.on(
                                            'error',
                                            function(err){
                                                console.log('Error is: ', err); done();
                                                ipc.disconnect('unixServerSync');
                                            }
                                    );
                                    
                                }
                            );
                         }
                    );
                }
        );
    // End of test cases for Unix
    }
);

