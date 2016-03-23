'use strict';

const os = require('os');

class Defaults{
    constructor(){
        const IPType=os.networkInterfaces()[
            Object.keys(os.networkInterfaces())[0]
        ][0].family;

        Object.defineProperties(
            this,
            {
                appspace        : {
                    enumerable:true,
                    writable:true,
                    value:'app.'
                },
                socketRoot      : {
                    enumerable:true,
                    writable:true,
                    value:'/tmp/'
                },
                networkHost     : {
                    enumerable:true,
                    writable:true,
                    value:(IPType=='IPv6')? '::1' : '127.0.0.1'
                },
                networkPort     : {
                    enumerable:true,
                    writable:true,
                    value:8000
                },
                id              : {
                    enumerable:true,
                    writable:true,
                    value:os.hostname()
                },
                encoding        : {
                    enumerable:true,
                    writable:true,
                    value:'utf8'
                },
                rawBuffer       : {
                    enumerable:true,
                    writable:true,
                    value:false
                },
                sync            : {
                    enumerable:true,
                    writable:true,
                    value:false
                },
                silent          : {
                    enumerable:true,
                    writable:true,
                    value:false
                },
                logDepth:{
                    enumerable:true,
                    writable:true,
                    value:5
                },
                logInColor:{
                    enumerable:true,
                    writable:true,
                    value:true
                },
                maxConnections  : {
                    enumerable:true,
                    writable:true,
                    value:100
                },
                retry           : {
                    enumerable:true,
                    writable:true,
                    value:500
                },
                maxRetries      : {
                    enumerable:true,
                    writable:true,
                    value:Infinity
                },
                stopRetrying    : {
                    enumerable:true,
                    writable:true,
                    value:false
                },
                IPType          : {
                    enumerable:true,
                    writable:true,
                    value:IPType
                },
                tls             : {
                    enumerable:true,
                    writable:true,
                    value:false
                }
            }
        );
    }
}

module.exports=Defaults;
