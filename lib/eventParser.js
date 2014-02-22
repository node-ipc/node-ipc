function formatData(data){
    if(!data.data)
        data.data={};
    if(data.data['_maxListeners'])
        delete data.data;
    
    data=JSON.stringify(data)+parser.delimiter;
    return data;
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