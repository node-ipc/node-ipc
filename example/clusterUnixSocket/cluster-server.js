import ipc from "../../../node-ipc.js";
import fs from "fs";
import { cpus } from "os";
import cluster from "cluster";

const cpuCount = cpus().length;
const socketPath = "/tmp/ipc.sock";

ipc.config.unlink = false;

if (cluster.isMaster) {
  if (fs.existsSync(socketPath)) {
    fs.unlinkSync(socketPath);
  }

  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }
} else {
  ipc.serve(socketPath).then(() => {
    ipc.server.on("currentDate", function (data, socket) {
      console.log(`pid ${process.pid} got: `, data);
    });
  });

  ipc.server.start();
  console.log(`pid ${process.pid} listening on ${socketPath}`);
}
