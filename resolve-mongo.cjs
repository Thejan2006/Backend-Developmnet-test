const dns = require('dns');
const fs = require('fs');

dns.setServers(['8.8.8.8']);
Promise.all([
  dns.promises.resolveSrv('_mongodb._tcp.cluster0.aojxybi.mongodb.net'),
  dns.promises.resolveTxt('cluster0.aojxybi.mongodb.net')
]).then(([srv, txt]) => {
  fs.writeFileSync('output.json', JSON.stringify({ srv, txt }, null, 2));
}).catch(console.error);
