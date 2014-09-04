var ipc = require('../node-ipc'),
    cmd = require('node-cmd'),
    fs  = require('fs'),
    tests = {},
    testCount=0,
    fails=[],
    passes=[];

ipc.config.id   = 'testHarness';

ipc.serve(
    function(){
        
    }
);

ipc.server.on(
    'pass',
    function(test,socket){
        ipc.log(socket.id.good,'passed',test.data);
        tests[socket.id].pass.push(test);
        passes.push(test);
    }
);

ipc.server.on(
    'fail',
    function(test,socket){
        ipc.log(socket.id.warn,'failed',test.data);
        tests[socket.id].fail.push(test);
        fails.push(test);
    }
);

ipc.server.on(
    'start.test',
    function(data,socket){
        
        socket.id=data.id;
        
        if(!data.id){
            ipc.log('start.test duration not passed for unknown test, so failing test'.error);
            socket.destroy();
            return;
        }
        
        if(!data.duration){
            ipc.log(data.id.notice, 'start.test duration not passed, so failing test'.error);
            ipc.disconnect(data.id);
            return;
        }
        
        ipc.log(data.id.notice, 'started'.debug);
        
        tests[data.id].started=true;
        clearTimeout(
            tests[data.id].delay
        );
        
        tests[data.id].delay=setTimeout(
            (
                function(test){
                    return function(){
                        ipc.log(test.warn," failed to complete ".error);
                        tests[test].fail.push('end.test');
                        fails.push(test+' >> end.test');
                        testCount--;
                        tests[socket.id].delay=null;
                        checkComplete();
                    }
                }    
            )(data.id),
            data.duration
        )
    }
);

ipc.server.on(
    'end.test',
    function(data,socket){
        ipc.log(socket.id.notice, 'completed'.debug);
        
        clearTimeout(
            tests[socket.id].delay
        );
        
        tests[socket.id].delay=null;
        
        testCount--;
        checkComplete();
    }
);

ipc.log('TestHarness started.'.debug, 'Loading Tests.'.notice);

ipc.server.define.listen['start.test']='This event should be called when a test is starting. It accepts an object with test details including the test id and duration';
ipc.server.define.listen['end.test']='This event should be called when a test is completed.';
ipc.server.define.listen['pass']='This event should be called when a test has passed, it accepts the name of the test portion which passed';
ipc.server.define.listen['fail']='This event should be called when a test has failed, it accepts the name of the test portion which failed';

ipc.server.start();

fs.readdir(
    'tests', 
    function(err,testFolders){
        if(err){
            ipc.log(err,'You must execute the testHarness from the testHarness directory'.error)
            return;
        }
        testCount=testFolders.length;
        
        for(var i =0; i<testFolders.length; i++){
            tests[testFolders[i]]={
                started : false,
                pass    : [],
                fail    : [],
                delay   : setTimeout(
                    (
                        function(test){
                            return function(){
                                ipc.log(test.warn," failed to start ".error);
                                tests[test].fail.push('start.test');
                                fails.push(test+' >> start.test');
                                testCount--;
                                checkComplete();
                            }
                        }
                    )(testFolders[i]),
                    1000
                )
            };
            
            runTests(testFolders[i])
        }
    }
);

function runTests(dir){
    fs.readdir(
        'tests/'+dir, 
        function(err,testFiles){
            if(err){
                ipc.log(err,'You must execute the testHarness from the testHarness directory'.error)
                return;
            }
            for(var i =0; i<testFiles.length; i++){
                cmd.run(
                    'node tests/'+dir+'/'+testFiles[i]
                );
            }
        }
    );
}

function checkComplete(){
    if(testCount)
        return;
        
    ipc.log('####################################\n\n         RESULTS\n\n####################################\n\n'.rainbow,tests,'\n\n');
    ipc.log('####################################\n\n         PASSES\n\n####################################\n\n'.good,passes.join('\n').good,'\n\n');
    ipc.log('####################################\n\n         FAILS\n\n####################################\n\n'.warn,fails.join('\n').warn,'\n\n');
    ipc.log('####################################\n\n         PASS/FAIL COUNT\n\n####################################\n\n'.data,(passes.length+' ').good,(fails.length+' ').warn,'\n\n');
    
    process.exit(0);
}