const ipc = require("../../../node-ipc");

/***************************************\
 *
 * You should start both hello and world
 * then you will see them communicating.
 *
 * *************************************/

ipc.config.id = "world";
ipc.config.retry = 1500;

const messages = {
  goodbye: false,
  hello: false,
};

ipc.serveNet(function () {
  ipc.server.on("app.message", function (data, socket) {
    ipc.log("got a message from", socket.id, data);
    messages[socket.id] = true;
    ipc.server.emit(socket, "app.message", {
      message: data.message + " world!",
    });

    if (messages.hello && messages.goodbye) {
      ipc.log("got all required events, telling clients to kill connection");
      ipc.server.broadcast("kill.connection");
    }
  });

  ipc.server.on("socket.disconnected", function (socket, id) {
    ipc.log("DISCONNECTED from ", id, "\n\n");
  });
});

ipc.server.start();
