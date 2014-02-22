/************************************\
 * 
 * The events var was instantiated
 * as it's own scope
 * 
 * **********************************/

var thing={
    id:'my thing'
}
/******************************\
 * 
 * Create events in the scope
 * of the "thing" object
 * 
 * ****************************/
new window.pubsub(thing);

thing.on(
    'getID',
    function(){
        eventLog.log('things id is : ',this.id);
    }
);

thing.on(
    'setID',
    function(id){
        eventLog.log('setting id to : ',id);
        this.id=id;
        this.trigger('getID');
    }
);

/**********************************\
 * 
 * Demonstrate * event (on all events)
 * remove this for less verbose
 * example
 * 
 * ********************************/
thing.on(
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

/************************************\
 * trigger events for testing
 * **********************************/
thing.trigger('getID');

thing.trigger(
    'setID',
    'your thing'
)