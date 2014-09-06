var ipc = require('../../../node-ipc');

ipc.config.id   = __dirname.split('/');
ipc.config.id   = ipc.config.id[ipc.config.id.length-1]
ipc.config.maxRetries=1;

var expectedClient=ipc.config.id+'-client';

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
                        duration: 1400
                    }
                );
            }
        )
    }
);

ipc.serve(
    function(){
        
    }
);

ipc.server.on(
    'connect',
    function(){
        ipc.of.testHarness.emit(
            'pass',
            'unix-server-connection'
        );
    }
)

ipc.server.on(
    'socket.disconnected',
    function(socket,id){
        var test='unix-server-detected-correct-id-disconnection';
        if(id==expectedClient){
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
        ipc.of.testHarness.emit(
            'end.test'
        );
        
        setTimeout(
            function(){
                process.exit(0);
            },
            400
        )
    }
)

ipc.server.on(
    'test-test',
    function(data,socket){
        ipc.of.testHarness.emit(
            'pass',
            'unix-client-message'
        );
        
        var test='unix-client-registered with proper id'
        
        if(socket.id==expectedClient){
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
    }
);

ipc.server.define.listen['test-test']='Registers and tests ipc communication.';

ipc.server.start();