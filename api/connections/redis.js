
import _redis from 'redis';
import process from 'process'

const {
  REDIS_HOST: host,
  REDIS_PORT: port,
  REDIS_PASSWORD: password,
  REDIS_PREFIX: prefix,
} = process.env

const cfg = { socket: { host, port, } }
if (password) cfg.password = password;
if (prefix) cfg.prefix = prefix;
// cfg.database = 0

const redis = _redis.createClient(cfg);
setTimeout(() => {
  redis.connect();
}, 100)

// module.exports.redisGetAsync = redis.get;
export const redisPub = _redis.createClient(cfg);
export const redisSub = _redis.createClient(cfg);

// client.set(key, value, { 'EX': 10 });

export const redisDelete = async (searchKey) => {
  const keys = await redis.keys(`${searchKey}*`);
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    await redis.del(key);
  }
};

const withKey = async (key) => {
  const value = await redis.get(key)
  return { key, value }
}

export const redisKeys = async (key, getKeys = false, asMap = false) => {
  const keys = await redis.keys(`${key}*`);
  if (!getKeys) return keys;
  if (getKeys && !asMap) {
    const prom = [];
    keys.forEach(k => {
      prom.push(redis.get(k))
    })
    const all = await Promise.all(prom);
    return all
  }
  // get all keys as map 
  const prom = [];
  keys.forEach(k => {
    prom.push(withKey(k))
  })
  const all = await Promise.all(prom);
  return all
}

redis.on('connect', () => {
  // console.info('Redis          OK');
});

redis.on('ready', () => {
  global.redis_ok = true
  console.log('✅  REDIS      OK', host);
});

redis.on('end', () => {
  console.warn('Redis     END');
});

redis.on('reconnecting', () => {
  console.warn('Redis     RECONNECTING');
});

redis.on('error', (err) => {
  console.error('Redis Connection Error', err);
  process.exit(1)
});

export default redis;
