import ipc from "../../dist/node-ipc.js";
import process from "process";

const dieAfter = 30e3;

function killServerProcess() {
  process.exit(0);
}

setTimeout(killServerProcess, dieAfter);

ipc.config.id = "unixServerSync";
ipc.config.retry = 1500;
ipc.config.silent = true;

ipc.serve().then(() => {
  let ready = false;

  ipc.server.on("message", function gotMessage(data, socket) {
    if (ready) {
      ipc.server.emit(socket, "message", {
        id: ipc.config.id,
        message:
          "Error, client not wating for server response before sending request.",
      });
    }

    ipc.server.emit(socket, "message", {
      id: ipc.config.id,
      message: "Response from unix server",
    });
  });
});

ipc.server.on("END", killServerProcess);

ipc.server.start();
