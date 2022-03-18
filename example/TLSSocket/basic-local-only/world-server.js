const ipc = require("../../../node-ipc");

/***************************************\
 *
 * You should start both hello and world
 * then you will see them communicating.
 *
 * *************************************/

ipc.config.id = "world";
ipc.config.retry = 1500;
//node-ipc will default to its local certs
ipc.config.tls = {
  rejectUnauthorized: false,
};

ipc.serveNet(function () {
  ipc.server.on("message", function (data, socket) {
    ipc.log("got a message from ", socket.id, data);
    ipc.server.emit(socket, "message", data + " world!");
  });

  ipc.server.on("socket.disconnected", function (socket, id) {
    ipc.log("DISCONNECTED from ", id, "\n\n");
  });
});

ipc.server.on("error", function (err) {
  ipc.log("Got an ERROR!", err);
});

ipc.server.start();
