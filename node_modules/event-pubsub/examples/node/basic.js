var events = new require('../../event-pubsub.js')();

/************************************\
 * 
 * The events var was instantiated
 * as it's own scope
 * 
 * **********************************/

events.on(
    'hello',
    function(data){
        console.log('hello event recieved ', data);
    }
);

events.on(
    'hello',
    function(data){
        console.log('Second handler listening to hello event got',data);
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
        console.log('World event got',data);
        events.off('*');
        console.log('Removed all events');
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
        console.log('Catch all detected event type of : ',type, '. List of all the sent arguments ',arguments);
    }
);

/************************************\
 * trigger events for testing
 * **********************************/
events.trigger(
    'hello',
    'world'
);