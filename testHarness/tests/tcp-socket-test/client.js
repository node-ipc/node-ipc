var ipc=require('../../../node-ipc'),
    server=__dirname.split('/'),
    server=server[server.length-1]

ipc.config.id   = server+'-client';
ipc.config.maxRetries=50;

ipc.connectToNet(
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
                
                //wait to ensure above event has opportunity to tranfer and register client properly
                setTimeout(
                    function(){
                        ipc.disconnect(server);
                    },
                    100
                );
                
                //wait long enough that the test will fail if disconnect does not happen
                setTimeout(
                    function(){
                        process.exit(0);
                    },
                    2000
                )
            }
        );
    }
);