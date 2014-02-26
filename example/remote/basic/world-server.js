var ipc=require('../../../node-ipc');

/***************************************\
 * 
 * You should start both hello and world
 * then you will see them communicating.
 * 
 * *************************************/

ipc.config.id   = 'world';
ipc.config.retry= 1500;

ipc.serveTCP(
    function(){
        ipc.server.on(
            'message',
            function(data,socket){
                ipc.log('got a message : '.debug, data);
                socket.emit(
                    'message',
                    data+' world!'
                );
            }
        );
    }
);

ipc.server.define.listen.message='This event type listens for message strings as value of data key.';

ipc.server.start();