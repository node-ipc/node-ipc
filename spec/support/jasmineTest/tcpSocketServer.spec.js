var ipc = require('../../../../node-ipc');
    
    ipc.config.id ='testWorld';
    ipc.config.retry = 1000;


describe('Unix Socket verification of server',
         function(){
            
            it(
                'Verify server detects only 1 client out of 2 clients and receives message.',
                function(done){
                    
                    var clientCounter =0;
                    ipc.config.maxConnections=1;
                    
                    ipc.serveNet(
                        function(){
                            ipc.server.on(
                                'app.message',
                                function(data,socket){
                                    
                                    clientCounter++;
                                    
                                    expect(data.id).toBe('client1');
                                    expect(data.message).toBe('I am client1');
                                    
                                }
                            );
                            
                            setTimeout(
                                 function(){
                                     expect(clientCounter).toBe(1);
                                     
                                     done();
                                 },2000
                            );
                        }
                    );
                        
                    ipc.server.start();
                    
                }
            );
    
        /*
            xit(
                'Verify server detects clients named "client1" and receives message.',
                function(done){
                    ipc.serve(
                        function(){
                            ipc.server.on(
                                'app.message',
                                function(data,socket){
                                    
                                    console.log('Client connected is: ', data.id);
                                    expect(data.id).toBe('client1');
                                    expect(data.message).toBe('I am client1');
                                    done();
                                }
                            );
                        }
                    );
                    ipc.server.start();
                    
                }
            );
    
        xit(
                'Verify server receives disconnection from the connected client.',
                function(done){
                    
                    ipc.serve(
                        function(){
                            ipc.server.on(
                                'app.message',
                                function(data,socket){
                                    console.log('Client connected is: ', data.id);
                                   
                                    ipc.server.on(
                                        'close',
                                        function(){
                                            console.log('Client closed: ', data.id);
                                            done();
                                        }
                                    );
                                    
                                }
                            );
                            

                        }
                    );
                    
                   ipc.server.start();
                    
                }
            );
     */
    }
);

