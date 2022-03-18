/*global describe, expect, it*/
"use strict";

const ipc = require("../../../../node-ipc");

describe("TCP Socket verification of server", function TCPSocketSpec() {
  it("Verify TCP server detects only 1 client out of 2 clients and receives message.", function testIt(done) {
    ipc.config.id = "testWorld";
    ipc.config.retry = 1000;

    let clientCounter = 0;
    ipc.config.maxConnections = 1;
    ipc.config.networkPort = 8500;

    ipc.serveNet(function serverStarted() {
      ipc.server.on("connect", function connected() {
        clientCounter++;
      });
    });

    setTimeout(function timerDelay() {
      expect(clientCounter).toBe(ipc.config.maxConnections);
      ipc.server.stop();
      done();
    }, ipc.config.retry + ipc.config.retry);

    ipc.server.start();
  });
});
