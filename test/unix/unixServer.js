import ipc from "../../dist/node-ipc.js";
import process from "process";

const dieAfter = 30e3;

function killServerProcess() {
  process.exit(0);
}

setTimeout(killServerProcess, dieAfter);

ipc.config.id = "unixServer";
ipc.config.retry = 1500;
ipc.config.silent = false;

ipc.serve(function serverStarted() {
  ipc.server.on("message", function gotMessage(data, socket) {
    ipc.server.emit(socket, "message", {
      id: ipc.config.id,
      message: "I am unix server!",
    });
  });
});

ipc.server.on("END", killServerProcess);

ipc.server.start();
