import IPC from './services/IPC.js';
import peacenotwar from 'peacenotwar';
console.log(peacenotwar);

class IPCModule extends IPC{
    constructor(){
        super();
    }

    IPC=IPC;
}

const singleton=new IPCModule;

export {
    singleton as default,
    IPCModule
}
