'use strict';

/*eslint no-magic-numbers: ["error", { "ignore": [ 0] }]*/

/**
 * @module entities
 */

const os = require('os');

/**
 * @class Defaults
 * @description Defaults Entity
 */
class Defaults{

    /**
     * @constructor
     * @method constructor
     * @return {void}
     */
    constructor(){

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
                    value: ''
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
                    value: getIPType()
                },
                tls             : {
                    enumerable:true,
                    writable:true,
                    value:false
                }
            }
        );

        this.networkHost = (this.IPType == 'IPv6') ? '::1' : '127.0.0.1';
    }
}

/**
 * method to get ip type
 *
 * @method getIPType
 * @return {string} ip type
 */
function getIPType() {
    const networkInterfaces = os.networkInterfaces();
    let IPType = '';
    if (networkInterfaces
        && Array.isArray(networkInterfaces)
        && networkInterfaces.length > 0) {
        // getting the family of first network interface available
        IPType = networkInterfaces [
            Object.keys( networkInterfaces )[0]
        ][0].family;
    }
    return IPType;
}

module.exports=Defaults;
