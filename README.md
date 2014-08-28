#node-ipc
*a nodejs module for local and remote Inter Process Communication* for Linux, Mac and Windows.  
A great solution for **Neural Networking** in Node.JS

**npm install node-ipc**  
[![alt node-ipc npm details](https://nodei.co/npm/node-ipc.png?stars=true "node-ipc npm module details ")](https://npmjs.org/package/node-ipc "node-ipc details from npm")

Package details websites :
* [GitHub.io site](http://riaevangelist.github.io/node-ipc/ "node-ipc documentation"). A prettier version of this site.
* [NPM Module](https://www.npmjs.org/package/node-ipc "node-ipc npm module"). The npm page for the node-ipc module.

This work is licenced via the [DBAD Public Licence](http://www.dbad-license.org/). 

----
#### Contents

1. [Types of IPC Sockets and Supporting OS](#types-of-ipc-sockets)
2. [IPC Methods](#ipc-methods)
    1. [log](#log)
    2. [connectTo](#connectto)
    3. [connectToNet](#connecttonet)
    4. [disconnect](#disconnect)
    5. [serve](#serve)
    6. [serveNet](#servenet)
3. [IPC Stores and Default Variables](#ipc-stores-and-default-variables)
4. [Basic Examples](#basic-examples)
    1. [Server for Unix Sockets & TCP Sockets](#server-for-unix-sockets--tcp-sockets)
    2. [Client for Unix Sockets & TCP Sockets](#client-for-unix-sockets--tcp-sockets)
    3. [Server & Client for UDP Sockets](#server--client-for-udp-sockets)
5. [Advanced Examples](https://github.com/RIAEvangelist/node-ipc/tree/master/example)


----
#### Types of IPC Sockets

| Type      | Stability |Definition |
|-----------|-----------|-----------|
|Unix Socket| Stable    | Gives Linux and Mac lightning fast communication and avoids the network card to reduce overhead and latency. [Local Unix Socket examples ](https://github.com/RIAEvangelist/node-ipc/tree/master/example/unixSocket/ "Unix Socket Node IPC examples")  |
|TCP Socket | Stable    | Gives the most reliable communication across the network. Can be used for local IPC as well, but is slower than #1's Unix Socket Implementation because TCP sockets go through the network card while Unix Sockets do not. [Local or remote network TCP Socket examples ](https://github.com/RIAEvangelist/node-ipc/tree/master/example/TCPSocket/ "TCP Socket Node IPC examples") |
|TLS Socket | Alpha     | ***coming soon...*** |
|UDP Sockets| Stable    | Gives the **fastest network communication**. UDP is less reliable but much faster than TCP. It is best used for streaming non critical data like sound, video, or multiplayer game data as it can drop packets depending on network connectivity and other factors. UDP can be used for local IPC as well, but is slower than #1's Unix Socket Implementation because UDP sockets go through the network card while Unix Sockets do not. [Local or remote network UDP Socket examples ](https://github.com/RIAEvangelist/node-ipc/tree/master/example/UDPSocket/ "UDP Socket Node IPC examples") |  

| OS  | Supported Sockets  |
|-----|--------------------|
|Linux| Unix, TCP, TLS, UDP|
|Mac  | Unix, TCP, TLS, UDP|
|Win  | TCP, TLS, UDP      |  

**Windows** users may want to use UDP servers for the fastest local IPC. Unix Servers are the fastest oprion on Linux and Mac, but not available for windows.  

----

``ipc.config``  

Set these variables in the ``ipc.config`` scope to overwrite or set default values.

    {
        appspace        : 'app.',
        socketRoot      : '/tmp/',
        id              : os.hostname(),
        networkHost     : 'localhost',
        networkPort     : 8000,
        encoding        : 'utf8',
        silent          : false,
        maxConnections  : 100,
        retry           : 500,
        maxRetries      : 0,
        stopRetrying    : false
    }


| variable | documentation |
|----------|---------------|
| appspace | used for Unix Socket (Unix Domain Socket) namespacing. If not set specifically, the Unix Domain Socket will combine the socketRoot, appspace, and id to form the Unix Socket Path for creation or binding. This is available incase you have many apps running on your system, you may have several sockets with the same id, but if you change the appspace, you will still have app specic unique sockets.|
| socketRoot| the directory in which to create or bind to a Unix Socket |
| id       | the id of this socket or service |
| networkHost| the local or remote host on which TCP, TLS or UDP Sockets should connect |
| networkPort| the default port on which TCP, TLS, or UDP sockets should connect |
| encoding | the default encoding for data sent on sockets |
| silent   | turn on/off logging default is false which means logging is on |
| maxConnections| this is the max number of connections allowed to a socket. It is currently only being set on Unix Sockets. Other Socket types are using the system defaults. |
| retry    | this is the time in milliseconds a client will wait before trying to reconnect to a server if the connection is lost. This does not effect UDP sockets since they do not have a client server relationship like Unix Sockets and TCP Sockets. |
| maxRetries    | the maximum number of retries after each disconnect before giving up and completely killing a specific connection |
| stopRetrying| Defaults to false mwaning clients will continue to retryt to connect to servers indefinately at the retry interval. If set to any number the client will stop retrying when that number is exceeded after each disconnect. If set to 0, the client will ***NOT*** try to reconnect. |

----

#### IPC Methods  
These methods are available in the IPC Scope.  

----
##### log

``ipc.log(a,b,c,d,e...);``  

ipc.log will accept any number of arguments and if ``ipc.config.silent`` is not set, it will concat them all with a sincle space ' ' between them and then log them to the console. This is fast because it prevents any concation from happening if the ipc is set to silent. That way if you leave your logging in place it should not effect performance.

the log also supports [colors](https://github.com/Marak/colors.js) implementation. All of the available styles are supported and the theme styles are as follows :

    {
        good    : 'green',
        notice  : 'yellow',
        warn    : 'red',
        error   : 'redBG',
        debug   : 'magenta',
        variable: 'cyan',
        data    : 'blue'
    }    

You can override any of these settings by requireing colors and setting the theme as follows :

    var colors=require('colors');
    
    colors.setTheme(
        {
            good    : 'zebra',
            notice  : 'redBG',
            ...
        }    
    );
----
##### connectTo

``ipc.connectTo(id,path,callback);``  

Used for connecting as a client to local Unix Sockets. ***This is the fastst way for processes on the same machine to communicate*** because it bypasses the network card which TCP and UDP must both use.

| variable | required | definition |
|----------|----------|------------|
| id       | required |  is the string id of the socket being connected to. The socket with this id is added to the ipc.of object when created. |
| path     | optional | is the path of the Unix Domain Socket File, if not set this will be defaylted to ``ipc.config.socketRoot``+``ipc.config.appspace``+``id`` |
| callback | optional | this is the function to execute when the socket has been created. |

**examples** arguments can be ommitted solong as they are still in order.

    ipc.connectTo('world');
    
or using just an id and a callback
    
    ipc.connectTo(
        'world',
        function(){
            ipc.of.world.on(
                'hello',
                function(data){
                    ipc.log(data.debug); 
                    //if data was a string, it would have the color set to the debug style applied to it
                }
            )
        }
    );

or explicitly setting the path

    ipc.connectTo(
        'world',
        'myapp.world'
    );
    
or explicitly setting the path with callback

    ipc.connectTo(
        'world',
        'myapp.world',
        function(){
            ...
        }
    );
----
##### connectToNet

``ipc.connectToNet(id,host,port,callback)``  

Used to connect as a client to a TCP or TLS socket via the network card. This can be local or remote, if local, it is recommended that you use the Unix Socket Implementaion of ``connectTo`` instead as it is much faster since it avoids the network card alltogether.

| variable | required | definition |
|----------|----------|------------|
| id       | required | is the string id of the socket being connected to. For TCP & TLS sockets, this id is added to the ``ipc.of`` object when the socket is created with a refrence to the socket. |
| host     | optional | is the host on which the TCP or TLS socket resides.  This will default to  ``ipc.config.networkHost`` if not specified. |
| port     | optional | the port on which the TCP or TLS socket resides. |
| callback | optional | this is the function to execute when the socket has been created. |

**examples** arguments can be ommitted solong as they are still in order.  
So while the default is : (id,host,port,callback), the following examples will still work because they are still in order (id,port,callback) or (id,host,callback) or (id,port) etc.

    ipc.connectToNet('world');
    
or using just an id and a callback
    
    ipc.connectToNet(
        'world',
        function(){
            ...
        }
    );

or explicitly setting the host and path

    ipc.connectToNet(
        'world',
        'myapp.com',serve(path,callback)
        3435
    );
    
or only explicitly setting port and callback

    ipc.connectToNet(
        'world',
        3435,
        function(){
            ...
        }
    );

----
##### disconnect

``ipc.disconnect(id)``  

Used to disconnect a client from a Unix, TCP or TLS socket. The socket and its refrence will be removed from memory and the ``ipc.of`` scope. This can be local or remote. UDP clients do not maintain connections and so there are no Clients and this method has no value to them.

| variable | required | definition |
|----------|----------|------------|
| id       | required | is the string id of the socket from which to disconnect. |

**examples**

    ipc.disconnect('world');

----
##### serve
``ipc.serve(path,callback);``  

Used to create local Unix Socket Server to which Clients can bind. The server can ``emit`` events to specific Client Sockets, or ``broadcast`` events to all known Client Sockets.   

| variable | required | definition |
|----------|----------|------------|
| path     | optional | This is the Unix Domain Socket path to bind to. If not supplied, it will default to : ipc.config.socketRoot + ipc.config.appspace + ipc.config.id; |
| callback | optional | This is a function to be called after the Server has started. This can also be done by binding an event to the start event like ``ipc.server.on('start',function(){});`` |

***examples*** arguments can be ommitted solong as they are still in order.

    ipc.serve();

or specifying callback

    ipc.serve(
        function(){...}
    );
    
or specify path

    ipc.serve(
        '/tmp/myapp.myservice'
    );
    
or specifying everything

    ipc.serve(
        '/tmp/myapp.myservice',
        function(){...}
    );

----    
##### serveNet

``serveNet(host,port,UDPType,callback)``

Used to create TCP, TLS or UDP Socket Server to which Clients can bind or other servers can send data to. The server can ``emit`` events to specific Client Sockets, or ``broadcast`` events to all known Client Sockets. 


| variable | required | definition |
|----------|----------|------------|
| host     | optional | If not specified this defaults to localhost. For TCP, TLS & UDP servers this is most likely going to be localhost or 0.0.0.0 unless you have something like [node-http-server](https://github.com/RIAEvangelist/node-http-server) installed to run subdomains for you. |
| port     | optional | The port on which the TCP, UDP, or TLS Socket server will be bound, this defaults to 8000 if not specified |
| UDPType  | optional | If set this will create the server as a UDP socket. 'udp4' or 'udp6' are valid values. This defaults to not being set.
| callback | optional | Function to be called when the server is created |

***examples*** arguments can be ommitted solong as they are still in order.

default tcp server

    ipc.serveNet();
    
default udp server

    ipc.serveNet('udp4');

or specifying TCP server with callback

    ipc.serveNet(
        function(){...}
    );
    
or specifying UDP server with callback

    ipc.serveNet(
        'udp4',
        function(){...}
    );
    
or specify port

    ipc.serveNet(
        3435
    );
    
or specifying everything TCP

    ipc.serveNet(
        'MyMostAwesomeApp.com',
        3435,
        function(){...}
    );

or specifying everything UDP

    ipc.serveNet(
        'MyMostAwesomeApp.com',
        3435,
        'udp4',
        function(){...}
    );

----
### IPC Stores and Default Variables  

| variable  | definition |
|-----------|------------|
| ipc.of    | This is where socket connection refrences will be stored when connecting to them as a client via the ``ipc.connectTo`` or ``iupc.connectToNet``. They will be stored based on the ID used to create them, eg : ipc.of.mySocket|
| ipc.server| This is a refrence to the server created by ``ipc.serve`` or ``ipc.serveNet``|

----
### Basic Examples 
You can find [Advanced Examples](https://github.com/RIAEvangelist/node-ipc/tree/master/example) in the examples folder. In the examples you will find more complex demos including multi client examples.

#### Server for Unix Sockets & TCP Sockets 
The server is the process keeping a socket for IPC open. Multiple sockets can connect to this server and talk to it. It can also broadcast to all clients or emit to a specific client. This is the most basic example which will work for both local Unix Sockets and local or remote network TCP Sockets.

    var ipc=require('node-ipc');

    ipc.config.id   = 'world';
    ipc.config.retry= 1500;
    
    ipc.serve(
        function(){
            ipc.server.on(
                'message',
                function(data,socket){
                    ipc.log('got a message : '.debug, data);
                    ipc.server.emit(
                        'message',
                        data+' world!'
                    );
                }
            );
        }
    );
    
    ipc.server.start();

#### Client for Unix Sockets & TCP Sockets 
The client connects to the servers socket for Inter Process Communication. The socket will recieve events emitted to it specifically as well as events which are broadcast out on the socket by the server. This is the most basic example which will work for both local Unix Sockets and local or remote network TCP Sockets.

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
    
#### Server & Client for UDP Sockets 
UDP Sockets are different than Unix & TCP Sockets because they must be bound to a unique port on their machine to recieve messages. For example, A TCP or Unix Socket client could just connect to a seperate TCP or Unix Socket sever. That client could then exchange, both send and recive, data on the servers port or location. UDP Sockets can not do this. They must bind to a port to recieve or send data.  

This means a UDP Client and Server are the same thing because inorder to recieve data, a UDP Socket must have its own port to recieve data on, and only one process can use this port at a time. It also means that inorder to ``emit`` or ``broadcast`` data the UDP server will need to know the host and port of the Socket it intends to broadcast the data to.

This is the most basic example which will work for both local Unix Sockets and local or remote network TCP Sockets.

##### UDP Server 1 - "World" 

    var ipc=require('../../../node-ipc');

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
    
##### UDP Server 2 - "Hello"
*note* we set the port here to 8001 because the world server is already using the default ipc.config.networkPort of 8000. So we can not bind to 8000 while world is using it.

    ipc.config.id   = 'hello';
    ipc.config.retry= 1500;
    
    ipc.serveNet(
        8001,
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
