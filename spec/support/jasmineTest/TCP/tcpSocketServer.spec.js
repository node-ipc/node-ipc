var ipc = require('../../../../node-ipc');
    
ipc.config.id ='testWorld';
ipc.config.retry = 1000;


describe('TCP Socket verification of server',
         function(){
    
             it(
                'Verify TCP server detects only 1 client out of 2 clients and receives message.',
                function(done){
                    
                    var clientCounter =0;
                    ipc.config.maxConnections=1;
                    ipc.config.networkPort=8500;
                    
                    ipc.serveNet(
                        function(){
                            ipc.server.on(
                                'app.message',
                                function(data,socket){
                                    
                                    clientCounter++;
                                    
                                    expect(data.id).toBe('tcpClient');
                                    expect(data.message).toBe('I am TCP client.');
                                    
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
         }
);

