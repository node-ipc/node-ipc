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
 * Since there is no open client server
 * relationship, you should start world
 * first and then hello.
 * 
 * *************************************//

ipc.config.id   = 'world';
ipc.config.retry= 1500;

ipc.serveNet(
    'udp4',
    function(){
        console.log(123);
        ipc.server.on(
            'message',
            function(data,socket){
                ipc.log('got a message from '.debug, data.id.variable ,' : '.debug, data.message.data);
                ipc.server.emit(
                    socket,
                    'message',
                    {
                        id      : ipc.config.id,
                        message : data.message+' world!'
                    }
                );
            }
        );
        
    }
);

ipc.server.define.listen.message='This event type listens for message strings as value of data key.';

ipc.server.start();