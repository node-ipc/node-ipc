var ipc = require('../../../node-ipc'),
    server=__dirname.split('/'),
    server=server[server.length-1]

ipc.config.id   = server+'-client';
ipc.config.maxRetries=1;

ipc.connectTo(
    server,
    function(){
        ipc.of[server].on(
            'connect',
            function(){
                ipc.of[server].emit(
                    'test-test',
                    {
                        id:ipc.config.id
                    }
                );
                
                process.exit();
            }
        );
    }
);