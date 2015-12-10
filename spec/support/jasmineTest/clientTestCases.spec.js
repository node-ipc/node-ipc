var ipc = require('../../../../node-ipc');
    
    ipc.config.id ='testClient';
    ipc.config.retry = 600;
    

describe('Test Cases for client: ',
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
    
    // UDP Test Cases //
        it(
                'Verify UDP server "testClient" connects to UDP server named "udpServer" and receives message.',
                function(done){
                    ipc.serveNet(
                        8001,
                        'udp4',
                         function(){
                             ipc.server.on(
                                'message',
                                function(data,socket){
                                    expect(data.id).toBe('udpServer');
                                    expect(data.message).toBe('I am UDP server!');
                                    done();
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
                                    message : 'I am client'
                                }
                            );
                             
                             ipc.server.on(
                                'error',
                                function(err){
                                    console.log('Error is: ', err);
                                    
                                }
                            );
                         }
                    );
                    ipc.server.start();
                }
            );
       
        xit(
            'Verify UDP server of type udp6 connects to UDP server named "udp6Server" and receives message.',
            function(done){
                
                ipc.serveNet(
                        8001,
                        'udp6',
                         function(){
                             ipc.server.on(
                                'message',
                                function(data,socket){
                                    expect(data.id).toBe('udp6Server');
                                    expect(data.message).toBe('I am UDP6 server!');
                                    done();
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
                                    console.log('Error is: ', err);
                                    
                                }
                            );
                         }
                    );
                    ipc.server.start();
                }
            );
     
 
    // TCP Client test cases
    
        it(
            'Verify retry attempts by TCP client to connect to the server as per the value set in "maxRetries" parameter.',
                function(done){
                    
                    var tcpRetryAttempt = 3; //variable created to count the attempt made by client to connect to the server.
                    ipc.config.maxRetries = 3;
                    ipc.config.stopRetrying = false;
                    ipc.config.silent= false;
                    
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
                                        
                                        
                                    }
                                        else if(ipc.of.tcpFakeServer.retriesRemaining < 0){
                                        
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
                    
                    var tcpRetryAttempt = 3; //variable created to count the attempt made by client to connect to the server.
                    ipc.config.maxRetries = 3;
                    ipc.config.stopRetrying = true;
                    
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
    
    
    
    // End test cases
    
    
          }
);

