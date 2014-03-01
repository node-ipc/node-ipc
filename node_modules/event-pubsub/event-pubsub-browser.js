window.pubsub=(
    function(){

        function sub(type,handler){
            checkScope.apply(this);
                
            if(!this._events_[type])
                this._events_[type]=[];
                
            this._events_[type].push(handler);
        }
        
        function unsub(type,handler){
            checkScope.apply(this);
    
            if(type=='*'){
                var params=Array.prototype.slice.call(arguments,1);
                for(
                    var keys    = Object.keys(this._events_),
                        count   = keys.length,
                        i=0;
                    i<count;
                    i++
                ){
                    var args=params.unshift(keys[i]);
                    this.off.call(args);
                }
            }
                
            if(!this._events_[type])
                return;
            
            if(!handler){
                delete this._events_[type];
                return;
            }
            
            if(this._events_[type].length<2){
                delete this._events_[type];
                return;
            }
            
            for(var i=0, 
                    count=this._events_[type].length;
                i<count;
                i++
            ){
                if(this._events_[type][i]==handler)
                    this._events_[type].splice(i,1);
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
        
        return init;
        
    }
)();