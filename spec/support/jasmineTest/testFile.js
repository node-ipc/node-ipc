'use strict';
const cmd=require('node-cmd');

cmd.run(`node ${__dirname}/unixServer.js`);
cmd.run(`node ${__dirname}/unixServerSync.js`);

cmd.run(`node ${__dirname}/udp4Server.js`);
cmd.run(`node ${__dirname}/udp6Server.js`);

cmd.run(`node ${__dirname}/tcpServer.js`);
cmd.run(`node ${__dirname}/tcpServerSync.js`);

cmd.run(`node ${__dirname}/unixClient.js`);
cmd.run(`node ${__dirname}/unixClient.js`);

cmd.run(`node ${__dirname}/tcpClient.js`);
cmd.run(`node ${__dirname}/tcpClient.js`);
