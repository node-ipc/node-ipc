var ipc=require('../../../node-ipc');

/***************************************\
 *
 * You should start both hello and world
 * then you will see them communicating.
 *
 * *************************************/

ipc.config.id   = 'world';
ipc.config.retry= 1500;
ipc.config.tls={
    public: '../../../local-node-ipc-certs/server.pub',
    private: '../../../local-node-ipc-certs/private/server.key',
    dhparam: '../../../local-node-ipc-certs/private/dhparam.pem',
    requestCert: true,
    rejectUnauthorized:false,
    trustedConnections: [
        '../../../local-node-ipc-certs/client.pub'
    ]
}

ipc.serveNet(
    function(){
        ipc.server.on(
            'message',
            function(data,socket){
                ipc.log('got a message : '.debug, data);
                ipc.server.emit(
                    socket,
                    'message',
                    data+' world!'
                );
            }
        );

        ipc.server.on(
            'socket.disconnected',
            function(data,socket){
                console.log(arguments)
            }
        );
    }
);

ipc.server.define.listen.message='This event type listens for message strings as value of data key.';

ipc.server.start();
