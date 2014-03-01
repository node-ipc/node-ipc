Event PubSub
============

Pubsub events for Node and the browser allowing event scoping and multiple scopes. 
Easy for any developer level. No frills, just high speed pubsub events!

[Pretty GitHub.io site](http://riaevangelist.github.io/event-pubsub/)  

[![alt event-pubsub npm details](https://nodei.co/npm/event-pubsub.png?stars=true "event-pubsub npm package details")](https://npmjs.org/package/event-pubsub)

**EXAMPLE FILES**  

1. [Node Pubsub Event Examples](https://github.com/RIAEvangelist/event-pubsub/tree/master/examples/node)  
2. [Browser Pubsub Event Examples](https://github.com/RIAEvangelist/event-pubsub/tree/master/examples/browser)

**Node Install**  
``npm install event-pubsub``

**Browser Install**  
*see browser examples above or below*

---
### Basic Example
---
***NOTE - the only diffeence between node and browser code is how the ``events`` variable is created***  
* node ``var events = new require('../../event-pubsub.js')();``
* browser ``var events = new window.pubsub();``

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
    
    events.on(
        'removeEvents',
        function(){
            events.off('*');
            console.log('Removed all events');
        }
    );
    
    /************************************\
     * trigger events for testing
     * **********************************/
    events.trigger(
        'hello',
        'world'
    );
    
    events.trigger(
        'removeEvents'
    );
    

#### Browser
##### HTML

    <!DOCTYPE html>
    <html>
        <head>
            <title>PubSub Example</title>
            <script src='../../event-pubsub-browser.js'></script>
            <script src='yourAmazingCode.js'></script>
        </head>
        <body>
            ...
        </body>
    </html>

##### Inside Your Amazing Code

    var events = new window.pubsub();

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
    
    events.on(
        'removeEvents',
        function(){
            events.off('*');
            console.log('Removed all events');
        }
    );
    
    /************************************\
     * trigger events for testing
     * **********************************/
    events.trigger(
        'hello',
        'world'
    );
    
    events.trigger(
        'removeEvents'
    );
