import VanillaTest from "@node-ipc/vanilla-test";
import Is from "strong-type";
import { IPCModule } from "../../dist/node-ipc.js";
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
    test.expects(
      'TCP client to connection attempts to be limited by the "maxRetries" parameter.'
    );

    const ipc = new IPCModule();

    ipc.config.id = "testClient";
    ipc.config.retry = 60;
    ipc.config.maxRetries = 3;
    ipc.config.stopRetrying = false;
    ipc.config.silent = true;

    //set to -1 because there is an error on the first fail
    //before retrying
    let errorCount = -1;

    ipc.connectToNet("tcpFakeServer", 8002, function open() {});

    ipc.of.tcpFakeServer.on("error", function gotError(err) {
      errorCount++;
      is.defined(err);
    });

    await delay(ipc.config.retry * ipc.config.maxRetries + transmit_delay);

    ipc.config.stopRetrying = true;

    ipc.of.tcpFakeServer.emit("END");

    ipc.disconnect("tcpFakeServer");

    test.compare(errorCount, ipc.config.maxRetries);
  } catch (err) {
    fail(err);
  }
  cleanup();

  try {
    test.expects(
      'TCP client not to try to reconnect when "stopRetrying" is set to true.'
    );

    const ipc = new IPCModule();
    ipc.config.maxRetries = 3;
    ipc.config.stopRetrying = true;
    ipc.silent = true;

    //set to -1 because there is an error on the first fail
    //before retrying
    let errorCount = -1;

    ipc.connectToNet("tcpFakeServer", 8002, function open() {});

    ipc.of.tcpFakeServer.on("error", function gotError(err) {
      is.defined(err);
      errorCount++;
    });

    await delay(ipc.config.retry * ipc.config.maxRetries + transmit_delay);

    test.compare(errorCount, 0);
    test.compare(ipc.of.tcpFakeServer.retriesRemaining, ipc.config.maxRetries);

    ipc.disconnect("tcpFakeServer");
  } catch (err) {
    fail(err);
  }
  cleanup();

  try {
    test.expects(
      'TCP client to connect to server named "tcpServer" and receive a message.'
    );

    const ipc = new IPCModule();

    ipc.config.maxRetries = 3;
    ipc.config.stopRetrying = true;
    ipc.silent = true;

    let data = {};

    ipc.connectToNet("tcpServer", 8300, function open() {
      ipc.of.tcpServer.on("connect", function connected() {
        ipc.of.tcpServer.emit("message", {
          id: ipc.config.id,
          message: "Hello from testClient.",
        });

        console.log("client sent message");
      });

      ipc.of.tcpServer.on("message", function gotMessage(message) {
        data = message;
        console.log("client got message");
      });
    });

    ipc.of.tcpServer.on("error", function gotError(err) {
      fail(err);
    });

    await delay(ipc.config.retry * ipc.config.maxRetries + transmit_delay);

    console.log(data);

    test.compare(data.id, "tcpServer");
    test.compare(data.message, "I am TCP server!");

    ipc.of.tcpServer.emit("END");

    ipc.disconnect("tcpServer");
  } catch (err) {
    fail(err);
  }
  cleanup();
}

export { run as default, run };
