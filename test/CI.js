//TCP TESTS
import cmd from 'node-cmd';
import {run as TCPClientRun} from './TCP/client.js';
import {run as TCPServerRun} from './TCP/server.js';

function logOutput(name,err, data, stderr){
    console.log(`
        
        
        ${name} OUTPUT
        
        
    `);

    console.log(err, data, stderr)
}

cmd.run(
    'node ./test/TCP/TCPServer.js',
    function(err, data, stderr){
        logOutput('TCP SERVER',err, data, stderr)
    }
);
cmd.run(
    'node ./test/TCP/TCPClient.js',
    function(err, data, stderr){
        logOutput('TCP CLIENT',err, data, stderr)       
    }

);


await TCPClientRun();
await TCPServerRun();
