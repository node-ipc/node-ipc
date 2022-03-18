export interface Config {
    /**
     * Default: 'app.'
     * Used for Unix Socket (Unix Domain Socket) namespacing.
     * If not set specifically, the Unix Domain Socket will combine the socketRoot, appspace,
     * and id to form the Unix Socket Path for creation or binding.
     * This is available incase you have many apps running on your system, you may have several sockets with the same id,
     * but if you change the appspace, you will still have app specic unique sockets
     */
    appspace: string;
    /**
     * Default: '/tmp/'
     * The directory in which to create or bind to a Unix Socket
     */
    socketRoot: string;
    /**
     * Default: os.hostname()
     * The id of this socket or service
     */
    id: string;
    /**
     * Default: 'localhost'
     * The local or remote host on which TCP, TLS or UDP Sockets should connect
     * Should resolve to 127.0.0.1 or ::1 see the table below related to this
     */
    networkHost: string;
    /**
     * Default: 8000
     * The default port on which TCP, TLS, or UDP sockets should connect
     */
    networkPort: number;
    /**
     * Default: false
     * Makes the pipe readable for all users including windows services
     */
    readableAll: boolean;
    /**
     * Default: false
     * Makes the pipe writable for all users including windows services
     */
    writableAll: boolean;
    /**
     * Default: 'utf8'
     * the default encoding for data sent on sockets. Mostly used if rawBuffer is set to true.
     * Valid values are : ascii utf8 utf16le ucs2 base64 hex
     */
    encoding: "ascii" | "utf8" | "utf16le" | "ucs2" | "base64" | "hex";
    /**
     * Default: false
     * If true, data will be sent and received as a raw node Buffer NOT an Object as JSON.
     * This is great for Binary or hex IPC, and communicating with other processes in languages like C and C++
     */
    rawBuffer: boolean;
    /**
     * Default: false
     * Synchronous requests. Clients will not send new requests until the server answers
     */
    sync: boolean;
    /**
     * Default: false
     * Turn on/off logging default is false which means logging is on
     */
    silent: boolean;
    /**
     * Default: true
     * Turn on/off util.inspect colors for ipc.log
     */
    logInColor: boolean;
    /**
     * Default: 5
     * Set the depth for util.inspect during ipc.log
     */
    logDepth: number;
    /**
     * Default: console.log
     * The function which receives the output from ipc.log; should take a single string argument
     */
    logger(msg: string): void;
    /**
     * Default: 100
     * This is the max number of connections allowed to a socket. It is currently only being set on Unix Sockets.
     * Other Socket types are using the system defaults
     */
    maxConnections: number;
    /**
     * Default: 500
     * This is the time in milliseconds a client will wait before trying to reconnect to a server if the connection is lost.
     * This does not effect UDP sockets since they do not have a client server relationship like Unix Sockets and TCP Sockets
     */
    retry: number;
    /*  */
    /**
     * Default: false
     * if set, it represents the maximum number of retries after each disconnect before giving up
     * and completely killing a specific connection
     */
    maxRetries: boolean | number;
    /**
     * Default: false
     * Defaults to false meaning clients will continue to retry to connect to servers indefinitely at the retry interval.
     * If set to any number the client will stop retrying when that number is exceeded after each disconnect.
     * If set to true in real time it will immediately stop trying to connect regardless of maxRetries.
     * If set to 0, the client will NOT try to reconnect
     */
    stopRetrying: boolean;
    /**
     * Default: true
     * Defaults to true meaning that the module will take care of deleting the IPC socket prior to startup.
     * If you use node-ipc in a clustered environment where there will be multiple listeners on the same socket,
     * you must set this to false and then take care of deleting the socket in your own code.
     */
    unlink: boolean;
    /**
     * Primarily used when specifying which interface a client should connect through.
     * see the socket.connect documentation in the node.js api https://nodejs.org/api/net.html#net_socket_connect_options_connectlistener
     */
    interfaces?: {
        /**
         * Default: false
         */
        localAddress?: boolean | undefined;
        /**
         * Default: false
         */
        localPort?: boolean | undefined;
        /**
         * Default: false
         */
        family?: boolean | undefined;
        /**
         * Default: false
         */
        hints?: boolean | undefined;
        /**
         * Default: false
         */
        lookup?: boolean | undefined;
    };
    tls: {
        rejectUnauthorized?: boolean | undefined;
        public?: string | undefined;
        private?: string | undefined;
    } | false;
}
