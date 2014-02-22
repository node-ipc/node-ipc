var pubsub = require('../../event-pubsub.js');

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
new pubsub(thing);

thing.on(
    'getID',
    function(){
        console.log('things id is : ',this.id);
    }
);

thing.on(
    'setID',
    function(id){
        console.log('setting id to : ',id);
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
        console.log('Catch all detected event type of : ',type, '. List of all the sent arguments ',arguments);
    }
);

thing.trigger('getID');

thing.trigger(
    'setID',
    'your thing'
)