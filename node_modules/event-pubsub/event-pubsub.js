function sub(type,handler){
    checkScope.apply(this);
        
    if(!this._events_[type])
        this._events_[type]=[];
        
    this._events_[type].push(handler);
}

function unsub(type,handler){
    checkScope.apply(this);
    
    if(!this._events_[type])
        return;
    
    if(!handler){
        delete this._events_[type];
        return;
    }
    
    for(var i=0, 
        count=this._events_[type].length;
        i<count;
        i++){
            
            if(this._events_[type][i]==handler)
                delete this._events_[type][i];
        return;
    }
}

function pub(type){
    checkScope.apply(this);
    
    if(this._events_['*'] && type!='*'){
        var params=Array.prototype.slice.call(arguments);
        params.unshift('*');
        this.trigger.apply(this,params);
    }
    
    if(!this._events_[type])
        return;
        
    for(var i=0, 
            events=this._events_[type], 
            count=events.length,
            args=Array.prototype.slice.call(arguments,1); 
    i<count; 
    i++){
        events[i].apply(this, args);
    }
}

function checkScope(){
    if(!this._events_)
        this._events_={};
}

function init(scope){
    if(!scope)
        return {
            on:sub,
            off:unsub,
            trigger:pub
        };
        
    scope.on=(
        function(scope){
            return function(){
                sub.apply(
                    scope, 
                    Array.prototype.slice.call(arguments)
                );
            }
        }
    )(scope);
    
    scope.off=(
        function(scope){
            return function(){
                unsub.apply(
                    scope, 
                    Array.prototype.slice.call(arguments)
                );
            }
        }
    )(scope);
    
    scope.trigger=(
        function(scope){
            return function(){
                pub.apply(
                    scope, 
                    Array.prototype.slice.call(arguments)
                );
            }
        }
    )(scope);
    
    scope._events_={};
}

module.exports=init