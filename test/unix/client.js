import VanillaTest from "vanilla-test";
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
      'unix client to connect to "unixServer" and receive a message.'
    );

    const ipc = new IPCModule();

    ipc.config.id = "testClient";
    ipc.config.retry = 900;

    let serverID = "";
    let serverMessage = "";

    let expectedServerID = "unixServer";
    let expectedMessage = "I am unix server!";

    ipc.connectTo("unixServer", function open() {
      ipc.of.unixServer.on("connect", function connected() {
        ipc.of.unixServer.on("message", function gotMessage(data) {
          serverID = data.id;
          serverMessage = data.message;
        });

        ipc.of.unixServer.emit("message", {
          id: ipc.config.id,
          message: "Hello from Client.",
        });
      });
    });

    await delay(transmit_delay);

    ipc.config.stopRetrying = true;

    ipc.of.unixServer.emit("END");
  } catch (err) {
    fail(err);
  }
  cleanup();

  try {
    test.expects(
      "the unix client to send synchronously when config.sync is set to true"
    );

    const ipc = new IPCModule();

    ipc.config.sync = true;
    ipc.config.silent = true;

    const messageTotal = 5;
    let responseCounter = 0;

    ipc.connectTo("unixServerSync", "/tmp/app.unixServerSync", function open() {
      ipc.of.unixServerSync.on("connect", function connected() {
        for (let i = 0; i < messageTotal; i++) {
          ipc.of.unixServerSync.emit("message", {
            id: ipc.config.id,
            message: "Unix Client Request ",
          });
        }

        ipc.of.unixServerSync.on("message", function gotMessage(data) {
          if (data.message !== "Response from unix server") {
            throw new Error("data.message!=='Response from unix server'");
          }
          responseCounter++;
        });
      });
    });

    await delay(transmit_delay);

    ipc.config.stopRetrying = true;

    test.compare(responseCounter, messageTotal);

    ipc.of.unixServerSync.emit("END");
  } catch (err) {
    fail(err);
  }
  cleanup();

  // try{
  //     test.expects(
  //         ''
  //     );

  //     const ipc=new IPCModule;

  // }catch(err){
  //     fail(err);
  // }
  // cleanup();
}

export { run as default, run };
