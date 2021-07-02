import IPC from './services/IPC.js';

class IPCModule extends IPC{
    constructor(){
        super();
        //include IPC to make extensible
        Object.defineProperty(
            this,
            'IPC',
            {
                enumerable:true,
                writable:false,
                value:IPC
            }
        )
    }
}

const singleton=new IPCModule;

export {
    singleton as default,
    IPCModule
}
