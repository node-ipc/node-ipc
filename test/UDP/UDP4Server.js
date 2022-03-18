import ipc from "../../dist/node-ipc.js";
import process from "process";

const dieAfter = 30e3;

function killServerProcess() {
  process.exit(0);
}

setTimeout(killServerProcess, dieAfter);

ipc.config.id = "udp4Server";
ipc.config.retry = 1500;
ipc.config.silent = true;
ipc.config.networkPort = 8095;

ipc.serveNet("127.0.0.1", "udp4").then(() => {
  ipc.server.on("message", function gotMessage(data, socket) {
    //console.log(data,socket)
    ipc.server.emit(socket, "message", {
      id: ipc.config.id,
      message: "I am UDP4 server!",
    });
  });

  ipc.server.on("END", killServerProcess);
});

ipc.server.start();
