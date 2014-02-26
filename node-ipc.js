var os          = require('os'),
    colors      = require('colors'),
    pubsub      = require('event-pubsub'),
    eventParser = require('./lib/eventParser.js'),
    Client      = require('./lib/client.js'),
    Server      = require('./lib/socketServer.js'),
    socketPrefix= 'app.';

colors.setTheme(
    {
        good    : 'green',
        notice  : 'yellow',
        warn    : 'red',
        error   : 'redBG',
        debug   : 'magenta',
        variable: 'cyan',
        data    : 'blue'
    }    
);

var defaults={
    root            : process.env.HOME,
    appspace        : socketPrefix,
    socketRoot      : '/tmp/',
    networkHost     : 'localhost',
    networkPort     : 8000,
    id              : os.hostname(),
    encoding        : 'utf8',
    silent          : false,
    maxConnections  : 100,
    retry           : 500
}

var ipc = {
    config      : defaults,
    connectTo   : connect,
    connectToTCP: connectTCP,
    serve       : serve,
    serveTCP    : serveTCP,
    of          : {},
    server      : false,
    log         : log
}

function log(){
    if(ipc.config.silent)
        return;
        
    console.log(
        Array.prototype.slice.call(arguments).join(' ')
    );
}

function serve(path,callback){
    if(typeof path=='function'){
        callback=path;
        path=false;   
    }
    if(!path){
        ipc.log(
            'Server path not specified, so defaulting to'.notice, 
            'ipc.config.socketRoot + ipc.config.appspace + ipc.config.id'.variable, 
            (ipc.config.socketRoot+ipc.config.appspace+ipc.config.id).data
        );
        path=ipc.config.socketRoot+ipc.config.appspace+ipc.config.id;
    }
    
    if(!callback)
        callback=function(){};
    
    ipc.server=new Server(
        path,
        ipc.config,
        log
    );
    
    ipc.server.on(
        'start',
        callback
    );
}

function serveTCP(host,port,callback){
    if(typeof host=='number'){
        callback=port;
        port=host;
        host=false;   
    }
    if(typeof host=='function'){
        callback=host;
        host=false;
        port=false;   
    }
    if(typeof port=='function'){
        callback=port;
        port=false;   
    }
    if(!port){
        ipc.log(
            'Server port not specified, so defaulting to'.notice, 
            'ipc.config.networkPort'.variable, 
            ipc.config.networkPort
        );
        port=ipc.config.networkPort;
    }
    if(!host){
        ipc.log(
            'Server host not specified, so defaulting to'.notice, 
            'ipc.config.networkHost'.variable, 
            ipc.config.networkHost.data
        );
        host=ipc.config.networkHost;
    }
    if(!callback)
        callback=function(){};
        
    ipc.server=new Server(
        host,
        ipc.config,
        log,
        port
    );
    
    ipc.server.on(
        'start',
        callback
    );
}

function connect(id,path,callback){
    if(typeof path == 'function'){
        callback=path;
        path=false;
    }
    
    if(!callback)
        callback=function(){};
    
    if(!id){
        ipc.log(
            'Service id required'.warn,
            'Requested service connection without specifying service id. Aborting connection attempt'.notice
        );
        return;
    }
    
    if(!path){
        ipc.log(
            'Service path not specified, so defaulting to'.notice, 
            'ipc.config.socketRoot + ipc.config.appspace + id'.variable, 
            (ipc.config.socketRoot+ipc.config.appspace+id).data
        );
        path=ipc.config.socketRoot+ipc.config.appspace+id;
    }
    
    if(ipc.of[id]){
        if(!ipc.of[id].socket.destroyed){
            ipc.log(
                'Already Connected to'.notice, 
                id.variable,
                '- So executing success without connection'.notice
            );
            callback();
            return;
        }
        ipc.of[id].destroy();
    }
    
    ipc.of[id]       = new Client(ipc.config,ipc.log);
    ipc.of[id].id    = id;
    ipc.of[id].path  = path;
    
    ipc.of[id].connect();
    
    callback();
}

function connectTCP(id,host,port,callback){
    if(!id){
        ipc.log(
            'Service id required'.warn,
            'Requested service connection without specifying service id. Aborting connection attempt'.notice
        );
        return;
    }
    
    if(typeof host=='number'){
        callback=port;
        port=host;
        host=false;   
    }
    if(typeof host=='function'){
        callback=host;
        host=false;
        port=false;   
    }
    if(typeof port=='function'){
        callback=port;
        port=false;   
    }
    if(!port){
        ipc.log(
            'Server port not specified, so defaulting to'.notice, 
            'ipc.config.networkPort'.variable, 
            ipc.config.networkPort
        );
        port=ipc.config.networkPort;
    }
    if(!host){
        ipc.log(
            'Server host not specified, so defaulting to'.notice, 
            'ipc.config.networkHost'.variable, 
            ipc.config.networkHost.data
        );
        host=ipc.config.networkHost;
    }
    if(!callback)
        callback=function(){};
    
    if(ipc.of[id]){
        if(!ipc.of[id].socket.destroyed){
            ipc.log(
                'Already Connected to'.notice, 
                id.variable,
                '- So executing success without connection'.notice
            );
            callback();
            return;
        }
        ipc.of[id].destroy();
    }
    
    ipc.of[id]       = new Client(ipc.config,ipc.log);
    ipc.of[id].id    = id;
    ipc.of[id].path  = host;
    ipc.of[id].port  = port;
    
    ipc.of[id].connect();
    
    callback();
}

module.exports=ipc;