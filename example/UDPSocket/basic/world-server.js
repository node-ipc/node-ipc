var ipc=require('../../../node-ipc');

/***************************************\
 * 
 * You should start both hello and world
 * then you will see them communicating.
 * 
 * *************************************/

ipc.config.id   = 'world';
ipc.config.retry= 1500;

ipc.serveNet(
    'udp4',
    function(){
        console.log(123);
        ipc.server.on(
            'message',
            function(data,socket){
                ipc.log('got a message from '.debug, data.from.variable ,' : '.debug, data.message.variable);
                ipc.server.emit(
                    socket,
                    'message',
                    {
                        from    : ipc.config.id,
                        message : data.message+' world!'
                    }
                );
            }
        );
        
        console.log(ipc.server);
    }
);

ipc.server.define.listen.message='This event type listens for message strings as value of data key.';

ipc.server.start();