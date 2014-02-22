Event PubSub
============

Pubsub events for Node and the browser allowing event scoping and multiple scopes. 
Easy for any developer level. No frills, just high speed pubsub events!

---
### Basic Examples
---
#### Node

    var events = new require('../../event-pubsub.js')();

    events.on(
        'hello',
        function(data){
            console.log('hello event recieved ', data);
        }
    );
    
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

#### Browser
##### HTML

    var events = new require('../../event-pubsub.js')();

    events.on(
        'hello',
        function(data){
            console.log('hello event recieved ', data);
        }
    );
    
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
