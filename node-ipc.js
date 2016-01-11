'use strict';

const colors = require('colors'),
    LogColors = require('./entities/LogColors.js'),
    IPC = require('./services/IPC.js');

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


colors.setTheme(new LogColors);

module.exports=new IPCModule;
