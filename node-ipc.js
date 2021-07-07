import IPC from './services/IPC.js';

class IPCModule extends IPC{
    constructor(){
        super();
    }
}

const singleton=new IPCModule;

export {
    singleton as default,
    IPCModule
}
