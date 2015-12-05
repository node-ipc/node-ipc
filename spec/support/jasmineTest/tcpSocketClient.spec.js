var ipc = require('../../../../node-ipc');
    
    ipc.config.id ='testClient';
    ipc.config.retry = 600;
    

describe('Unix Socket verification of client',
         function(){
            
            it(
                'Verify retry attempts by TCP client to connect to the server as per the value set in "maxRetries" parameter.',
                function(done){
                    
                    var retryAttempt = 3; //variable created to count the attempt made by client to connect to the server.
                    ipc.config.maxRetries = 3;
                    //ipc.config.silent= true;
                    
                    ipc.connectToNet(
                        'fakeworld',
                         8001,
                         function(){
                             ipc.of.fakeworld.on(
                                'disconnect',
                                function(){
                                    
                                    if(ipc.of.fakeworld.retriesRemaining == 1){
                                        expect(retryAttempt).toBe(ipc.of.fakeworld.retriesRemaining); 
                                        done();
                                    }
                                    retryAttempt--;
                                }
                            );
                        
                             ipc.of.fakeworld.on(
                                'error',
                                function(err){
                                    console.log('Error is: ', err);
                                    
                                }
                            );

                         }
                    );

                }
            );
            
            it(
                'Verify TCP client does not connect to the TCPserver when "stopRetrying" value is set to true.',
                function(done){
                    
                    var retryAttempt = 3; //variable created to count the attempt made by client to connect to the server.
                    ipc.config.maxRetries = 3;
                    ipc.config.stopRetrying = true;
                    
                    ipc.connectToNet(
                        'fakeworld',
                        8001,
                         function(){
                             ipc.of.fakeworld.on(
                                'disconnect',
                                function(){
                                    
                                    retryAttempt--;
                                    console.log('var value of retryAttempt: ',retryAttempt);
                                }
                            );
                            
                             setTimeout(
                                 function(){
                                     expect(retryAttempt).toBe(ipc.of.fakeworld.retriesRemaining); 
                                     expect(ipc.of.fakeworld.retriesRemaining).toBe(ipc.config.maxRetries); 
                                     
                                     done();
                                    },10
                            );
                             
                             ipc.of.fakeworld.on(
                                'error',
                                function(err){
                                    console.log('Error is: ', err);
                                    
                                }
                            );

                         }
                    );
                }
            );
    
       
    it(
                'Verify TCP client connects to server named "world" and receives message.',
                function(done){
                    ipc.connectToNet(
                        'world',
                        function(){
                            ipc.of.world.on(
                                'connect',
                                function(){
                                    
                                    ipc.of.world.emit(
                                        'app.message',
                                        {
                                            id      : ipc.config.id,
                                            message : 'Hello from Client.'
                                        }
                                    );
                                    
                                    ipc.of.world.on(
                                        'app.message',
                                        function(data,socket){
                                            console.log('data from world: ', data.id, data.message);
                                            
                                            expect(data.id).toBe('world');
                                            expect(data.message).toBe('I am world!');
                                            done();
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

