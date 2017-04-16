'use strict';

class Parser{
  constructor(config){
    Object.assign(
      this,
      {
        parse       : parseDataEvents,
        format      : formatData,
        delimiter   : config.delimiter||'\f'
      }
    );
  }

  formatData(message){
    if(!message.data && message.data!==false && message.data!==0){
        message.data={};
    }
    if(message.data['_maxListeners']){
        message.data={};
    }

    message=message.JSON+parser.delimiter;
    return message;
  }

  parseDataEvents(data){
    let events=data.split(parser.delimiter);
    events.pop();
    return events;
  }
}

module.exports=Parser;
