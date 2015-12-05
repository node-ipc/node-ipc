var ipc=require('../../../node-ipc');

ipc.config.id   = 'unixClient';
ipc.config.retry= 600;


ipc.connectTo(
    'testWorld',
    '/tmp/app.testWorld',
    function(){
        ipc.of.testWorld.on(
            'connect',
            function(){
                
                ipc.of.testWorld.emit(
                    'message',
                    {
                        id      : ipc.config.id,
                        message : 'I am unix client.'
                    }
                )
            }
        );
        ipc.of.testWorld.on(
            'disconnect',
            function(){
                ipc.log('disconnected from testWorld'.notice);
            }
        );
        ipc.of.testWorld.on(
            'message',
            function(data){
                ipc.log('got a message from testWorld : '.debug, data);
            }
        );
        
    }
);
