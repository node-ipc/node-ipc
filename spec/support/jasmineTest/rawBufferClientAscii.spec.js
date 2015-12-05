var ipc = require('../../../../node-ipc');
    
    ipc.config.id ='testClient';
    ipc.config.retry = 600;
    

describe('Raw Buffer tests: ',
         function(){
            
            it(
                'Verify data in hex is received from the server.',
                function(done){
                    
                    ipc.config.rawBuffer=true;
                    ipc.config.encoding='hex';
                    
                    ipc.connectToNet(
                        'rawBufferWorldAscii',
                        8000,
                        function(){
                             ipc.of.rawBufferWorldAscii.on(
                                'connect',
                                function(){
                                    ipc.log('## connected to world ##'.rainbow, ipc.config.delay);

                                }
                            );

                            ipc.of.rawBufferWorldAscii.on(
                                'data',
                                function(data){
                                    console.log('obtained data is: ',data);
                                    //expect(data).toBe('Buffer 31 30 30 61 30 31');
                                    done();
                                    //ipc.log('got a message from world : '.debug, data,data.toString());
                                }
                            );
                            
                            
                            ipc.of.rawBufferWorldAscii.on(
                                'error',
                                function(err){
                                    console.log('Error is: ', err);
                                    
                                }
                            );

                         }
                    );

                }
            );
            
            
                    
                    
 
    
          }
);

