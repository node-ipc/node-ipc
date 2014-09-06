var ipc=require('../../../node-ipc');

ipc.config.id   = __dirname.split('/');
ipc.config.id   = ipc.config.id[ipc.config.id.length-1]
ipc.config.maxRetries=1;

var expectedClient=ipc.config.id+'-client'

ipc.connectTo(
    'testHarness',
    function(){
        ipc.of.testHarness.on(
            'connect',
            function(){
                ipc.of.testHarness.emit(
                    'start.test',
                    {
                        id      : ipc.config.id,
                        duration: 1200
                    }
                );
                
                ipc.serveNet(
                    8001, // tcp test uses default of 8000 increment to ensure no collision 
                    'udp4',
                    function(){
                        ipc.of.testHarness.emit(
                            'pass',
                            'udp-server-started'
                        );
                    }
                );
                
                ipc.server.on(
                    'test-test',
                    function(data,socket){
                        var event={
                            id      : 'udp-client-id',
                            address : 'udp-client-address',
                            port    : 'udp-client-port'
                        }
                        
                        ipc.of.testHarness.emit(
                            'pass',
                            'udp-client-message'
                        );
                        
                        if(socket.id==expectedClient){
                            ipc.of.testHarness.emit(
                                'pass',
                                event.id
                            );  
                        }else{
                            ipc.of.testHarness.emit(
                                'fail',
                                event.id+' : detected wrong id of '+socket.id+' expecting :: '+expectedClient
                            );
                        }
                        
                        if(socket.address=='127.0.0.1'){
                            ipc.of.testHarness.emit(
                                'pass',
                                event.address
                            );  
                        }else{
                            ipc.of.testHarness.emit(
                                'fail',
                                event.port
                            );  
                        }
                        
                        if(socket.port==8002){
                            ipc.of.testHarness.emit(
                                'pass',
                                event.port
                            );  
                        }else{
                            ipc.of.testHarness.emit(
                                'fail',
                                event.port
                            );  
                        }
                        
                        ipc.of.testHarness.emit(
                            'end.test'
                        );
                        
                        setTimeout( //wait to ensure events sent to testHarness 
                            function(){
                                process.exit(0);
                            },
                            400
                        );
                    }
                );
                
                ipc.server.start();
            }
        )
    }
);