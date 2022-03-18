const ipc = require("../../../node-ipc");

/***************************************\
 *
 * You should start both hello and world
 * then you will see them communicating.
 *
 * *************************************/

ipc.config.id = "world";
ipc.config.retry = 1500;
ipc.config.rawBuffer = true;
ipc.config.encoding = "ascii";

ipc.serveNet(function () {
  ipc.server.on("connect", function (socket) {
    //manually assign id to group clients if desired
    if (!ipc.server.of.rawBufferClient) {
      ipc.server.of.rawBufferClient = [];
    }
    socket.id = "rawBufferClient";
    ipc.server.of.rawBufferClient.push(socket);

    ipc.server.emit(socket, "hello");
  });

  ipc.server.on("data", function (data, socket) {
    ipc.log("got a message", data, data.toString());
    ipc.server.emit(socket, "goodbye");
  });

  ipc.server.on("socket.disconnected", function (socket, id) {
    ipc.log("DISCONNECTED from ", id, "\n\n");
  });
});

ipc.server.start();
