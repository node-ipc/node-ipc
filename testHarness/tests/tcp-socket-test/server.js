var ipc=require('../../../node-ipc');

ipc.config.id   = __dirname.split('/');
ipc.config.id   = ipc.config.id[ipc.config.id.length-1]
ipc.config.maxRetries=1;

expectedClient=ipc.config.id+'-client';

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
            }
        )
    }
);

ipc.serveNet(
    function(){
        
    }
);

ipc.server.on(
    'connect',
    function(){
        ipc.of.testHarness.emit(
            'pass',
            'tcp-server-connection'
        );
    }
)

ipc.server.on(
    'socket.disconnected',
    function(socket,id){
        var test='tcp-server-detected-correct-id-disconnection';
        if(id==ipc.config.id+'-client'){
            ipc.of.testHarness.emit(
                'pass',
                test
            );
        }else{
            ipc.of.testHarness.emit(
                'fail',
                test+' : detected wrong id of '+socket.id+' expecting :: '+expectedClient
            );
        }
        ipc.of.testHarness.emit(
            'end.test'
        );
        
        process.exit(0);
    }
)

ipc.server.on(
    'test-test',
    function(data,socket){
        ipc.of.testHarness.emit(
            'pass',
            'tcp-client-message'
        );
        
        var test='tcp-client-registered with proper id'
        
        if(socket.id==expectedClient){
            ipc.of.testHarness.emit(
                'pass',
                test
            );  
        }else{
            ipc.of.testHarness.emit(
                'fail',
                test+' : detected wrong id of '+id+' expecting :: '+expectedClient
            );
        }
    }
);

ipc.server.define.listen.message='This event type listens for message strings as value of data key.';

ipc.server.start();