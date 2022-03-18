const ipc = require("../../../node-ipc");

/***************************************\
 *
 * You should start both hello and world
 * then you will see them communicating.
 *
 * *************************************/

ipc.config.id = "world";
ipc.config.retry = 1500;
ipc.config.sync = true;

ipc.serve(function () {
  ipc.server.on("message", function (data, socket) {
    ipc.log("got a message from ", socket.id, data);
    //fake some synch procedural code
    setTimeout(function () {
      ipc.server.emit(socket, "message", data + " world!");
    }, 3000);
  });

  ipc.server.on("socket.disconnected", function (socket, id) {
    ipc.log("DISCONNECTED from ", id, "\n\n");
  });
});

ipc.server.start();
