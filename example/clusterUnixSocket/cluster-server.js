const fs = from 'fs');
import ipc from '../../../node-ipc.js';
const cpuCount = from 'os').cpus().length;
const cluster = from 'cluster');
const socketPath = '/tmp/ipc.sock';

ipc.config.unlink = false;

if (cluster.isMaster) {
   if (fs.existsSync(socketPath)) {
       fs.unlinkSync(socketPath);
   }

   for (let i = 0; i < cpuCount; i++) {
       cluster.fork();
   }
}else{
   ipc.serve(
     socketPath,
     function() {
       ipc.server.on(
         'currentDate',
         function(data,socket) {
           console.log(`pid ${process.pid} got: `, data);
         }
       );
     }
  );

  ipc.server.start();
  console.log(`pid ${process.pid} listening on ${socketPath}`);
}
