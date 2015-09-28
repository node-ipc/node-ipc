var ipc=require('../../../node-ipc');

/***************************************\
 *
 * You should start both hello and world
 * then you will see them communicating.
 *
 * *************************************/

ipc.config.id   = 'world';
ipc.config.retry= 1500;
ipc.config.rawBuffer=true;
ipc.config.encoding='ascii';
ipc.config.networkHost='localhost';

ipc.config.tls={
    public: '../../../local-node-ipc-certs/server.pub',
    private: '../../../local-node-ipc-certs/private/server.key',
    dhparam: '../../../local-node-ipc-certs/private/dhparam.pem',
    requestCert: true,
    rejectUnauthorized:true,
    trustedConnections: [
        '../../../local-node-ipc-certs/client.pub'
    ]
}

ipc.serveNet(
    function(){
        ipc.server.on(
            'connect',
            function(socket){
                console.log('connection detected');
                ipc.server.emit(
                    socket,
                    'hello'
                );
            }
        );

        ipc.server.on(
            'data',
            function(data,socket){
                ipc.log('got a message'.debug, data,data.toString());
                ipc.server.emit(
                    socket,
                    'goodbye'
                );
            }
        );
    }
);

ipc.server.start();
