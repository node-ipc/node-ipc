var ipc = require('../../../node-ipc'),
    expectedClient=ipc.config.id+'-client';

ipc.config.id   = __dirname.split('/');
ipc.config.id   = ipc.config.id[ipc.config.id.length-1]
ipc.config.maxRetries=1;

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
                        duration: 1800
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
    'socket.disconnected',
    function(socket,id){
        ipc.of.testHarness.emit(
            'pass',
            'stopRetrying-unix-server'
        );
    
        ipc.of.testHarness.emit(
            'end.test'
        );
        
        process.exit(0);
    }
)

ipc.server.start();