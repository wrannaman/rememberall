import { MilvusClient } from '@zilliz/milvus2-sdk-node';

const milvus = new MilvusClient({
  address: process.env.MILVUS,
  tls: {
    // rootCert: readFileSync(`test/cert/ca.pem`),
    // privateKey: readFileSync(`test/cert/client.key`),
    // certChain: readFileSync(`test/cert/client.pem`),
    // serverName: 'localhost',
  },
});
// log out milvus status 
milvus.checkHealth().then(async (status) => {
  console.log(status?.isHealthy ? '✅  Milvus OK' : '❌  Milvus NOT OK')
  // will fail silently if db already exists. yay.
  const res = await milvus.createDatabase({
    db_name: "rememberall",
  });
  // const collections = await milvus.listCollections()
})


export default milvus