var ipc=require('../../../node-ipc');

/***************************************\
 * 
 * You should start both hello and world
 * then you will see them communicating.
 * 
 * *************************************/

ipc.config.id   = 'unixServerSync';
ipc.config.retry= 1500;

ipc.serve(
    function(){
        ipc.server.on(
            'message',
            function(data,socket){
                setTimeout(
                    function(){
                        ipc.server.emit(
                            socket,
                            'message',
                            {
                                id      : ipc.config.id,
                                message : 'Response from unix server'
                            }
                        );
                    },900
                );
            }
        );
    }
);


ipc.server.start();
