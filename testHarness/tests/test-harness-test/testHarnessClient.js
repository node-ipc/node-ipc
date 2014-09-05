var ipc = require('../../../node-ipc');

ipc.config.id   = __dirname.split('/');
ipc.config.id   = ipc.config.id[ipc.config.id.length-1]
ipc.config.maxRetries=1;

ipc.connectTo(
    'testHarness',
    function(){
        ipc.of.testHarness.on(
            'connect',
            function(){
                ipc.of.testHarness.emit(
                    'start.test',
                    {
                        id      : ipc.config.id,
                        duration: 1200
                    }
                );
                ipc.of.testHarness.emit(
                    'pass',
                    'test-harness-pass-test'
                );
                ipc.of.testHarness.emit(
                    'fail',
                    'test-harness-fail-test'
                );
                setTimeout(
                    function(){
                        //delay exit incase you want to test failure of start.test by modifying event name
                        ipc.of.testHarness.emit(
                            'end.test'
                        );
                        ipc.of.testHarness.disconnect();      
                    },
                    1000    
                );
            }
        );
    }
);

