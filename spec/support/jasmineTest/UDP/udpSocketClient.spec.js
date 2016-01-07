var ipc = require('../../../../node-ipc');
    
    ipc.config.id ='testClient';
    ipc.config.retry = 600;
    

describe(
        'UDP Socket verification.',
         function(){
             it(
                'Verify UDP server of type udp4 connects to UDP server named "udp4Server" and receives message.',
                function(done){
                    ipc.serveNet(
                        8001,
                        'udp4',
                         function(){
                             ipc.server.on(
                                'message',
                                function(data,socket){
                                    expect(data.id).toBe('udpServer');
                                    expect(data.message).toBe('I am UDP4 server!');
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
             
            it(
                'Verify UDP server of type udp6 connects to UDP server named "udp6Server" and receives message.',
                function(done){

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
         }
);