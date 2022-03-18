import ipc from "../../dist/node-ipc.js";
import process from "process";

const dieAfter = 30e3;

function killServerProcess() {
  process.exit(0);
}

setTimeout(killServerProcess, dieAfter);

ipc.config.id = "unixClient";
ipc.config.retry = 600;
ipc.config.silent = true;

ipc.connectTo("testWorld", "/tmp/app.testWorld");

ipc.connectTo("testWorld2", "/tmp/app.testWorld");
