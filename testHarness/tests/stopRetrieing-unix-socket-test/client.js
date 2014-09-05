var ipc = require('../../../node-ipc'),
    server=__dirname.split('/'),
    server=server[server.length-1]

ipc.config.id   = server+'-client';
ipc.config.stopRetrying=true;

//Wait to connect to ensure test server is started
setTimeout(
    function(){
        ipc.connectTo(
            server,
            function(){
                ipc.of[server].on(
                    'connect',
                    function(){
                        ipc.disconnect(server);
                        
                        //wait long enough that the test will fail if disconnect does not happen
                        setTimeout(
                            function(){
                                process.exit(0);
                            },
                            2000
                        );
                    }
                );
            }
        );
    },
    400
);