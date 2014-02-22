/************************************\
 * instantiating myEvents scope
 * **********************************/
var myEvents=new window.pubsub();

/************************************\
 * instantiating myEvents2 scope
 * **********************************/
var myEvents2=new window.pubsub();


/************************************\
 * binding myEvents events
 * **********************************/
myEvents.on(
    'hello',
    function(data){
        eventLog.log('myEvents hello event recieved ', data);
    }
);

myEvents.on(
    'hello',
    function(data){
        eventLog.log('Second handler listening to myEvents hello event got',data);
        myEvents.trigger(
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

myEvents.on(
    'world',
    function(data){
        eventLog.log('myEvents World event got',data);
    }
);

/**********************************\
 * 
 * Demonstrate * event (on all events)
 * remove this for less verbose
 * example
 * 
 * ********************************/
myEvents.on(
    '*',
    function(type){
        eventLog.log('myEvents Catch all detected event type of : ',type, '. List of all the sent arguments ',arguments);
    }
);

/************************************\
 * binding myEvents2 events
 * **********************************/
myEvents2.on(
    'hello',
    function(data){
        eventLog.log('myEvents2 Hello event should never be called ', data);
    }
);

myEvents2.on(
    'world',
    function(data){
        eventLog.log('myEvents2 World event ',data);
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
myEvents.trigger(
    'hello',
    'world'
);

myEvents2.trigger(
    'world',
    'is round'
);