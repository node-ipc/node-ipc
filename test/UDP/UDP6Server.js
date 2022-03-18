import ipc from "../../dist/node-ipc.js";
import process from "process";

const dieAfter = 30e3;

function killServerProcess() {
  process.exit(0);
}

setTimeout(killServerProcess, dieAfter);

ipc.config.id = "udp6Server";
ipc.config.retry = 1500;
ipc.config.silent = true;
ipc.config.networkPort = 8099;

ipc.serveNet("::1", "udp6", function serverStarted() {
  ipc.server.on("message", function gotMessage(data, socket) {
    ipc.server.emit(socket, "message", {
      id: ipc.config.id,
      message: "I am UDP6 server!",
    });
  });

  ipc.server.on("END", killServerProcess);
});

ipc.server.start();
