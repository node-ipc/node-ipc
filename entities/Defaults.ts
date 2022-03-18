import os from "os";
import { Config } from "../types/config";

class Defaults implements Config {
  constructor() {}

  appspace = "app.";
  socketRoot = "/tmp/";
  id = os.hostname();

  encoding: "ascii" | "utf8" | "utf16le" | "ucs2" | "base64" | "hex" = "utf8";
  rawBuffer = false;
  sync = false;
  unlink = true;

  delimiter = "\f";

  silent = false;
  logDepth = 5;
  logInColor = true;
  logger = console.log.bind(console);

  maxConnections = 100;
  retry = 500;
  maxRetries = Infinity;
  stopRetrying = false;

  IPType = getIPType();
  tls:
    | {
        rejectUnauthorized?: boolean | undefined;
        public?: string | undefined;
        private?: string | undefined;
      }
    | false = false;
  networkHost = this.IPType == "IPv6" ? "::1" : "127.0.0.1";
  networkPort = 8000;

  readableAll = false;
  writableAll = false;

  interface = {
    localAddress: false,
    localPort: false,
    family: false,
    hints: false,
    lookup: false,
  };
}

function getIPType() {
  const networkInterfaces = os.networkInterfaces();
  let IPType = "";
  if (
    networkInterfaces &&
    Array.isArray(networkInterfaces) &&
    networkInterfaces.length > 0
  ) {
    // getting the family of first network interface available
    IPType = networkInterfaces[Object.keys(networkInterfaces)[0]][0].family;
  }
  return IPType;
}

export { Defaults as default, Defaults };
