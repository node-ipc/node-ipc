#node-ipc
*a nodejs module for local and remote Inter Process Communication*

**npm install node-ipc**

*this is a new project so more documentation will come*

----
#### Local IPC
Uses Unix Sockets to give lightning fast communication and avoid the network card to reduce overhead and latency.

##### Server Example 
The server is the process keeping a Unix Socket for IPC open. Multiple sockets can connect to this server and talk to it. It can also broadcast to all clients or emit to a specific client.

    var ipc=require('node-ipc');

    ipc.config.id   = 'world';
    ipc.config.retry= 1500;
    
    ipc.serve(
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
    
    ipc.server.start();

##### Client Example 
The client connects to the servers Unix Socket for Inter Process Communication. The socket will recieve events emitted to it specifically as well as events which are broadcast out on the Unix Socket by the server.

    var ipc=require('../../../node-ipc');

    ipc.config.id   = 'hello';
    ipc.config.retry= 1500;
    
    ipc.connectTo(
        'world',
        function(){
            ipc.of.world.on(
                'connect',
                function(){
                    ipc.log('## connected to world ##'.rainbow, ipc.config.delay);
                    ipc.of.world.emit(
                        'message',
                        'hello'
                    )
                }
            );
            ipc.of.world.on(
                'disconnect',
                function(){
                    ipc.log('disconnected from world'.notice);
                }
            );
            ipc.of.world.on(
                'message',
                function(data){
                    ipc.log('got a message from world : '.debug, data);
                }
            );
        }
    );

----
#### Remote IPC - coming soon
Uses ``not yet defined`` Sockets to give fastest possible communication across the network with the minimum overhead and latency.

