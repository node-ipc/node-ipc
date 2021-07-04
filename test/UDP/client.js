import VanillaTest from 'vanilla-test';
import Is from 'strong-type';
import {IPCModule}   from '../../node-ipc.js';
import delay from '../../helpers/delay.js';

async function run(){

    const test=new VanillaTest;
    const is=new Is;

    const cleanup=function(){
        test.pass();
        test.done();
    }

    const fail=function(err){
        console.trace(err)
        test.fail();
    }

    var transmit_delay = 1000;

    try{
        test.expects(
            'UDP4 server to connect to "udpServer" and receive message.'
        );
        
        const ipc=new IPCModule;

        ipc.config.networkPort=8009;
        ipc.config.id ='testClient';
        ipc.config.retry = 60;
        ipc.config.maxRetries=3;

        let serverID='';
        let message='';
        
        const expectedServerID='udp4Server';
        const expectedMessage='I am UDP4 server!';

        const UDPAddr={
            address : '127.0.0.1',
            port    : 8095
        }


        ipc.serveNet(
            UDPAddr.address,
            'udp4',
            async function serverStarted(){
                ipc.server.on(
                    'message',
                    function gotMessage(data,socket){
                        console.log(data,socket)
                        serverID=data.id;
                        message=data.message;

                        ipc.server.emit(
                            UDPAddr,
                            'END'
                        );
                    }
                );
                
                //latency issues when running UDP4 via node-cmd
                await delay(transmit_delay);

                ipc.server.emit(
                    UDPAddr,
                    'message'
                );
            }
        );

        ipc.server.start();

        await delay(transmit_delay*3);
        
        console.log(serverID,expectedServerID,message,expectedMessage);
        test.compare(serverID,expectedServerID);
        test.compare(message,expectedMessage);

        ipc.server.stop();

    }catch(err){
        fail(err);
    }
    cleanup();




    try{
        test.expects(
            'UDP6 server to connect to "udp6Server" and receive message.'
        );
        
        const ipc=new IPCModule;

        ipc.config.networkPort=8007;
        ipc.config.id ='testClient';
        ipc.config.retry = 60;
        ipc.config.maxRetries=3;

        let serverID='';
        let message='';
        
        const expectedServerID='udp6Server';
        const expectedMessage='I am UDP6 server!';

        const UDP6Addr={
            address : '::1',
            port    : 8099
        }


        ipc.serveNet(
            UDP6Addr.address,
            'udp6',
            async function serverStarted(){
                ipc.server.on(
                    'message',
                    function gotMessage(data,socket){
                        serverID=data.id;
                        message=data.message;

                        ipc.server.emit(
                            UDP6Addr,
                            'END'
                        );
                    }
                );

                //latency issues when running UDP4 via node-cmd
                await delay(transmit_delay);

                ipc.server.emit(
                    UDP6Addr,
                    'message'
                );
            }
        );

        ipc.server.start();

        await delay(transmit_delay*3);

        
        
        console.log(serverID,expectedServerID,message,expectedMessage);
        test.compare(serverID,expectedServerID);
        test.compare(message,expectedMessage);

        ipc.server.stop();

    }catch(err){
        fail(err);
    }
    cleanup();
}

export {
    run as default,
    run
}