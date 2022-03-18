/*global describe, expect, it*/
"use strict";

const ipc = require("../../../../node-ipc");
const os = require("os").platform();

describe("TCP Socket verification of client", function TCPClientSpec() {
  var windows_delay = 0;

  if (os === "win32") {
    windows_delay = 4000;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  }

  it('Verify retry attempts by TCP client to connect to the server as per the value set in "maxRetries" parameter.', function testIt(done) {
    ipc.config.id = "testClient";
    ipc.config.retry = 60;
    ipc.config.maxRetries = 3;
    ipc.config.stopRetrying = false;

    //set to -1 because there is an error on the first fail
    //before retrying
    let errorCount = -1;

    ipc.connectToNet("tcpFakeServer", 8002, function open() {
      ipc.of.tcpFakeServer.on("error", function gotError(err) {
        errorCount++;
        expect(ipc.of.tcpFakeServer.retriesRemaining).toBe(
          ipc.config.maxRetries - errorCount
        );
        expect(err).toBeDefined();
      });
    });

    setTimeout(function testDelay() {
      expect(errorCount).toBe(ipc.config.maxRetries);
      ipc.disconnect("tcpFakeServer");
      done();
    }, ipc.config.retry * ipc.config.maxRetries +
      ipc.config.retry +
      ipc.config.retry +
      windows_delay);
  });

  it('Verify TCP client does not connect to the TCPserver when "stopRetrying" value is set to true.', function testIt(done) {
    ipc.config.maxRetries = 3;
    ipc.config.stopRetrying = true;
    ipc.silent = true;

    //set to -1 because there is an error on the first fail
    //before retrying
    let errorCount = -1;

    ipc.connectToNet("tcpFakeServer", 8002, function open() {
      ipc.of.tcpFakeServer.on("error", function gotError(err) {
        expect(ipc.of.tcpFakeServer.retriesRemaining).toBe(
          ipc.config.maxRetries
        );
        expect(err).toBeDefined();
        errorCount++;
      });
    });

    setTimeout(function testDelay() {
      expect(errorCount).toBe(0);
      expect(ipc.of.tcpFakeServer.retriesRemaining).toBe(ipc.config.maxRetries);
      ipc.disconnect("tcpFakeServer");
      done();
    }, ipc.config.retry * ipc.config.maxRetries + windows_delay);
  });

  it('Verify TCP client connects to server named "tcpServer" and receives message.', function testIt(done) {
    ipc.connectToNet("tcpServer", 8300, function open() {
      ipc.of.tcpServer.on("connect", function connected() {
        ipc.of.tcpServer.on("message", function gotMessage(data) {
          expect(data.id).toBe("tcpServer");
          expect(data.message).toBe("I am TCP server!");
          testDone();
        });

        ipc.of.tcpServer.emit("message", {
          id: ipc.config.id,
          message: "Hello from testClient.",
        });
      });

      ipc.of.tcpServer.on("error", function testError(err) {
        expect(err).toBe(false);
        testDone();
      });
    });

    function testDone() {
      ipc.disconnect("tcpServer");
      done();
    }
  });
});
