import VanillaTest from "vanilla-test";
import Is from "strong-type";
import { IPCModule } from "../../node-ipc.js";
import delay from "../../helpers/delay.js";

async function run() {
  const test = new VanillaTest();
  const is = new Is();

  const cleanup = function () {
    test.pass();
    test.done();
  };

  const fail = function (err) {
    console.trace(err);
    test.fail();
  };

  var transmit_delay = 1000;

  try {
    test.expects("Server to detect TCP client connection.");

    const ipc = new IPCModule();

    ipc.config.id = "testWorld";
    ipc.config.retry = 1000;

    ipc.config.networkPort = 8500;

    let requiredCount = 2;
    let requiredCounter = 0;

    ipc.serveNet(function serverStarted() {
      ipc.server.on("connect", function connected(socket) {
        requiredCounter++;
        ipc.server.on("message", function (data) {
          requiredCounter++;
        });
      });
    });

    ipc.server.start();

    await delay(transmit_delay * 2);

    ipc.server.broadcast("END");
    ipc.config.stopRetrying = true;
    ipc.server.stop();

    test.compare(requiredCount, requiredCounter);
  } catch (err) {
    fail(err);
  }
  cleanup();
}

export { run as default, run };
