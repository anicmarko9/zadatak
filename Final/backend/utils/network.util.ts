import * as os from "os";

/* >> This function returns IP Address
of Server on which API is running << */
export function getHostAddress(): string {
  const nets: NodeJS.Dict<os.NetworkInterfaceInfo[]> = os.networkInterfaces();
  const results: object = Object.create(null); // Or just '{}', an empty object
  let host: string = null;

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === "IPv4" && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
        host = net.address;
      }
    }
  }
  return host;
}
