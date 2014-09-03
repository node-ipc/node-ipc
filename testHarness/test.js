var ipc = require('../node-ipc'),
    cmd = require('node-cmd'),
    fs  = require('fs'),
    events= require('event-pubsub')(),
    tests = {};

ipc.config.id   = 'testHarness';

events.on(
    'startFailed',
    function(test){
        ipc.log(test.warn," failed to start ".error)
    }
);

ipc.serve(
    function(){
        ipc.server.on(
            'pass',
            function(data,socket){
                ipc.log(socket.id.good);
                socket
            }
        );
        
        ipc.server.on(
            'fail',
            function(err,socket){
                ipc.log(socket.id.warn,err);
                socket
            }
        );
        
        ipc.server.on(
            'start',
            function(data,socket){
                ipc.log(socket.id.notice, 'started'.debug);
                events.trigger(
                    'started-test-'+socket.id,
                    socket.id
                );
            }
        );
        
        
        ipc.log('TestHarness started.'.debug, 'Loading Tests.'.notice);
        
        fs.readdir(
            'tests', 
            function(err,tests){
                if(err){
                    ipc.log('You must execute the testHarness from the testHarness directory')
                    return;
                }
                for(var i =0; i<tests.length; i++){
                    tests[tests[i]]={
                        started : false,
                        pass    : false,
                        fail    : true,
                        delay   : setTimeout(
                            (
                                function(test){
                                    return function(){
                                        events.trigger(
                                            'startFailed', 
                                            test
                                        );
                                    }
                                }
                            )(tests[i]),
                            1000
                        )
                    };
                    runTests(tests[i])
                }
            }
        );
    }
);

ipc.server.define.listen['pass']='This event should be called when a test has passed';
ipc.server.define.listen['fail']='This event should be called when a test has failed, it accepts an argument for error conditions';

ipc.server.start();

function runTests(dir){
    fs.readdir(
        'tests/'+dir, 
        function(err,tests){
            if(err){
                ipc.log('You must execute the testHarness from the testHarness directory')
                return;
            }
            for(var i =0; i<tests.length; i++){
                events.on(
                    'started-test-'+tests[i],
                    function(id){
                        tests[id].started=true;
                        clearTimeout(
                            tests[id].delay
                        );
                    }
                );
                cmd.run('node '+tests[i]);
            }
        }
    );
}