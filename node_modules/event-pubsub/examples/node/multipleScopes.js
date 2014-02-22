var pubsub = require('../../event-pubsub.js');

/************************************\
 * instantiating myEvents scope
 * **********************************/
var myEvents=new pubsub();

/************************************\
 * instantiating myEvents2 scope
 * **********************************/
var myEvents2=new pubsub();


/************************************\
 * binding myEvents events
 * **********************************/
myEvents.on(
    'hello',
    function(data){
        console.log('myEvents hello event recieved ', data);
    }
);

myEvents.on(
    'hello',
    function(data){
        console.log('Second handler listening to myEvents hello event got',data);
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
        console.log('myEvents World event got',data);
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
        console.log('myEvents Catch all detected event type of : ',type, '. List of all the sent arguments ',arguments);
    }
);

/************************************\
 * binding myEvents2 events
 * **********************************/
myEvents2.on(
    'hello',
    function(data){
        console.log('myEvents2 Hello event should never be called ', data);
    }
);

myEvents2.on(
    'world',
    function(data){
        console.log('myEvents2 World event ',data);
    }
);


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