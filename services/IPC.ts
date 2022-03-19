import Defaults from "../entities/Defaults.js";
import Client from "../dao/client.js";
import Server from "../dao/socketServer.js";
import util from "util";
import type { Config } from "../types/config.js";

class IPC {
  constructor() {}

  //public members
  config: Config = new Defaults();
  of = {};
  server: Server | false = false;

  //protected methods
  get connectTo() {
    return connect;
  }
  get connectToNet() {
    return connectNet;
  }
  get disconnect() {
    return disconnect;
  }
  get serve() {
    return serve;
  }
  get serveNow() {
    return (path?: string) => {
      const promise = serve.bind(this)(path);
      (this.server as Server).start();
      return promise;
    };
  }
  get serveNet() {
    return serveNet;
  }
  get serveNetNow() {
    return (host: unknown, port?: unknown, UDPType?: unknown) => {
      const promise = serveNet.bind(this)(host, port, UDPType);
      (this.server as Server).start();
      return promise;
    };
  }
  protected get log() {
    return log;
  }
}

function log(...args) {
  if (this.config.silent) {
    return;
  }

  for (let i = 0, count = args.length; i < count; i++) {
    if (typeof args[i] != "object") {
      continue;
    }

    args[i] = util.inspect(args[i], {
      depth: this.config.logDepth,
      colors: this.config.logInColor,
    });
  }

  this.config.logger(args.join(" "));
}

function disconnect(id: string) {
  if (!this.of[id]) {
    return;
  }

  this.of[id].explicitlyDisconnected = true;

  this.of[id].off("*", "*");
  if (this.of[id].socket) {
    if (this.of[id].socket.destroy) {
      this.of[id].socket.destroy();
    }
  }

  delete this.of[id];
}

function serve(path?: string) {
  return new Promise<void>((resolve) => {
    if (!path) {
      this.log(
        "Server path not specified, so defaulting to",
        "ipc.config.socketRoot + ipc.config.appspace + ipc.config.id",
        this.config.socketRoot + this.config.appspace + this.config.id
      );
      path = this.config.socketRoot + this.config.appspace + this.config.id;
    }

    this.server = new Server(path, this.config, log);

    this.server.on("start", resolve);
  });
}

function serveNet(UDPType: string): Promise<void>;
function serveNet(port: number, UDPType: string): Promise<void>;
function serveNet(host: string, UDPType: string): Promise<void>;
function serveNet(host: string, port: number): Promise<void>;
function serveNet(host: string, port: number, UDPType: string): Promise<void>;
function serveNet(host: unknown, port?: unknown, UDPType?: unknown) {
  return new Promise<void>((resolve, reject) => {
    // Host omitted
    if (typeof host == "number") {
      UDPType = port;
      port = host;
      host = false;
    }
    // Port omitted
    if (
      typeof port == "string" &&
      (port.toLowerCase() == "udp4" || port.toLowerCase() == "udp6")
    ) {
      UDPType = port;
      port = false;
    }
    // Host & port omitted
    if (
      typeof host === "string" &&
      (host.toLowerCase() == "udp4" || host.toLowerCase() == "udp6")
    ) {
      UDPType = host.toLowerCase();
    }

    if (!host) {
      this.log(
        "Server host not specified, so defaulting to",
        "ipc.config.networkHost",
        this.config.networkHost
      );
      host = this.config.networkHost;
    }

    if (!port) {
      this.log(
        "Server port not specified, so defaulting to",
        "ipc.config.networkPort",
        this.config.networkPort
      );
      port = this.config.networkPort;
    }

    this.server = new Server(host as string, this.config, log, port as number);
    if (UDPType) {
      this.server[UDPType as string] = true;
      if (UDPType === "udp4" && host === "::1") {
        // bind udp4 socket to an ipv4 address
        this.server.path = "127.0.0.1";
      }
    }

    this.server.on("start", resolve);
  });
}

function connect(id: string, path?: string) {
  return new Promise<void>((resolve, reject) => {
    if (!id) {
      this.log(
        "Service id required",
        "Requested service connection without specifying service id. Aborting connection attempt"
      );
      return reject();
    }

    if (!path) {
      this.log(
        "Service path not specified, so defaulting to",
        "ipc.config.socketRoot + ipc.config.appspace + id",
        this.config.socketRoot + this.config.appspace + id
      );
      path = this.config.socketRoot + this.config.appspace + id;
    }

    if (this.of[id]) {
      if (!this.of[id].socket.destroyed) {
        this.log(
          "Already Connected to",
          id,
          "- So executing success without connection"
        );
        return resolve();
      }
      this.of[id].socket.destroy();
    }

    this.of[id] = new Client(this.config, this.log);
    this.of[id].id = id;
    this.of[id].socket ? (this.of[id].socket.id = id) : null;
    this.of[id].path = path;

    this.of[id].connect();

    resolve();
  });
}

function connectNet(id: string, port: number): Promise<void>;
function connectNet(id: string, host: string, port: number): Promise<void>;
function connectNet(id: string, host: unknown, port?: unknown) {
  return new Promise<void>((resolve, reject) => {
    if (!id) {
      this.log(
        "Service id required",
        "Requested service connection without specifying service id. Aborting connection attempt"
      );
      return reject("Service id required");
    }
    // Host omitted
    if (typeof host == "number") {
      port = host;
      host = false;
    }
    if (!host) {
      this.log(
        "Server host not specified, so defaulting to",
        "ipc.config.networkHost",
        this.config.networkHost
      );
      host = this.config.networkHost;
    }

    if (!port) {
      this.log(
        "Server port not specified, so defaulting to",
        "ipc.config.networkPort",
        this.config.networkPort
      );
      port = this.config.networkPort;
    }

    if (this.of[id]) {
      if (!this.of[id].socket.destroyed) {
        this.log(
          "Already Connected to",
          id,
          "- So executing success without connection"
        );
        return resolve();
      }
      this.of[id].socket.destroy();
    }

    this.of[id] = new Client(this.config, this.log);
    this.of[id].id = id;
    this.of[id].socket ? (this.of[id].socket.id = id) : null;
    this.of[id].path = host;
    this.of[id].port = port;

    this.of[id].connect();

    resolve();
  });
}

export { IPC as default, IPC };
