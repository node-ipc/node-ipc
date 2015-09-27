var Message = require('js-message');

function formatData(message){
    if(!message.data){
        message.data={};
    }
    if(message.data['_maxListeners']){
        message.data={};
    }

    message=message.JSON+parser.delimiter;
    return message;
};

function parseDataEvents(data){
    var events=data.split(parser.delimiter);
    events.pop();
    return events;
}

var parser={
    parse       : parseDataEvents,
    format      : formatData,
    delimiter   : '\f'
}

module.exports=parser;
