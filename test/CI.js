//TCP TESTS
import cmd from "node-cmd";
import { run as TCPClientRun } from "./TCP/client.js";
import { run as TCPServerRun } from "./TCP/server.js";
import { run as UDPRun } from "./UDP/client.js";
import { run as unixClientRun } from "./unix/client.js";

function logOutput(name, err, data, stderr) {
  console.log(`
        
        
        ${name} OUTPUT
        
        
    `);

  console.log(err, data, stderr);
}

cmd.run("node ./test/TCP/TCPServer.js", function (err, data, stderr) {
  logOutput("TCP SERVER", err, data, stderr);
});
cmd.run("node ./test/TCP/TCPClient.js", function (err, data, stderr) {
  logOutput("TCP CLIENT", err, data, stderr);
});

cmd.run("node ./test/UDP/UDP4Server.js", function (err, data, stderr) {
  logOutput("UDP4", err, data, stderr);
});
cmd.run("node ./test/UDP/UDP6Server.js", function (err, data, stderr) {
  logOutput("UDP6", err, data, stderr);
});

cmd.run("node ./test/unix/unixServer.js", function (err, data, stderr) {
  logOutput("unix/posix", err, data, stderr);
});
cmd.run("node ./test/unix/unixServerSync.js", function (err, data, stderr) {
  logOutput("unix/posix sync", err, data, stderr);
});

await TCPClientRun();
await TCPServerRun();
await UDPRun();
await unixClientRun();
