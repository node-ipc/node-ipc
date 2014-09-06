var ipc=require('../../../node-ipc'),
    server=__dirname.split('/'),
    server=server[server.length-1]

ipc.config.id   = server+'-client';

ipc.serveNet(
    8002, // tcp test uses default of 8000 udp server.js using 8001 increment to ensure no collision 
    'udp4',
    function(){
        setTimeout( //wait to ensure UDP server.js running 
            function(){
                ipc.server.emit(
                    {
                        address : 'localhost',
                        port    : 8001
                    },
                    'test-test',
                    {
                        id      : ipc.config.id
                    }
                );
                
                setTimeout( //wait to ensure test-test event sent 
                    function(){
                        process.exit(0);
                    },
                    400
                );
            },
            400
        );
    }
);

ipc.server.start();