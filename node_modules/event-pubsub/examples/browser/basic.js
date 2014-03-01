var events = new window.pubsub();

/************************************\
 * 
 * The events var was instantiated
 * as it's own scope
 * 
 * **********************************/

events.on(
    'hello',
    function(data){
        eventLog.log('hello event recieved ', data);
    }
);

events.on(
    'hello',
    function(data){
        eventLog.log('Second handler listening to hello event got',data);
        events.trigger(
            'world',
            {
                type:'myObject',
                data:{
                    x:'YAY, Objects!'   
                }
            }
        )
    }
);

events.on(
    'world',
    function(data){
        eventLog.log('World event got',data);
        events.off('*');
        eventLog.log('Removed all events')
    }
);

/**********************************\
 * 
 * Demonstrate * event (on all events)
 * remove this for less verbose
 * example
 * 
 * ********************************/
events.on(
    '*',
    function(type){
        eventLog.log('Catch all detected event type of : ',type, '. List of all the sent arguments ',arguments);
    }
);

/*******************************\
 * 
 * Prep HTML for logging
 * 
 * *****************************/
var eventLog=document.getElementById('events');
//not using console.log incase it doesn't work in some browser. *TLDT (Too lazy didn't test)*
eventLog.log=_log_;
function _log_ (){
    var events=Array.prototype.slice.call(arguments),
        newEvent=document.createElement('li');
    
    newEvent.innerHTML=events.join(' ');
    this.appendChild(newEvent);
}
 
events.trigger(
    'hello',
    'world'
);