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
    private: '../../../local-node-ipc-certs/private/server.key'
}

var messages={
    goodbye:false,
    hello:false
}

ipc.serveNet(
    function(){
        ipc.server.on(
            'app.message',
            function(data,socket){
                ipc.log('got a message from'.debug, (data.id).variable, (data.message).data);
                messages[data.id]=true;
                ipc.server.emit(
                    socket,
                    'app.message',
                    {
                        id      : ipc.config.id,
                        message : data.message+' world!'
                    }
                );

                if(messages.hello && messages.goodbye){
                    ipc.log('got all required events, telling clients to kill connection'.good);
                    ipc.server.broadcast(
                        'kill.connection',
                        {
                            id:ipc.config.id
                        }
                    );
                }
            }
        );
    }
);

ipc.server.define.listen['app.message']='This event type listens for message strings as value of data key.';
ipc.server.define.broadcast['kill.connection']='This event is a command to kill connection to this server, the data object will contain the id of this server incase the client needs it';

ipc.server.start();
