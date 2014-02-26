var ipc=require('../../../node-ipc');

/***************************************\
 * 
 * UDP Client is really a UDP server
 * 
 * Dedicated UDP sockets on the same 
 * machine can not be bound to in the
 * traditional client/server method
 * 
 * Every UDP socket is it's own UDP server
 * And so must have a unique port on its
 * machine, unlike TCP or Unix Sockts
 * which can share on the same machine.
 * 
 * *************************************/

ipc.config.id   = 'hello';
ipc.config.retry= 1500;

ipc.serveNet(
    8001, //we set the port here because the world server is already using the default of 8000. So we can not bind to 8000 while world is using it.
    'udp4',
    function(){
        ipc.server.on(
            'message',
            function(data){
                ipc.log('got Data');
                ipc.log('got a message from '.debug, data.from.variable ,' : '.debug, data.message.variable);
            }
        );
        ipc.server.emit(
            {
                address : 'localhost',
                port    : ipc.config.networkPort
            },
            'message',
            {
                from    : ipc.config.id,
                message : 'Hello'
            }
        );
    }
);

ipc.server.define.listen.message='This event type listens for message strings as value of data key.';

ipc.server.start();