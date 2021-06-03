import Redis from "ioredis";

export interface IClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  setKey<T>(key: string, value: T): Promise<void>;
  delKey(key: string): Promise<void>;
  getValue<T>(key: string): Promise<T>;
  getKeys(pattern: string): Promise<string[]>;
  getAllKeys(): Promise<string[]>;
  flushAllKeys(): Promise<void>;
}

function createClient(): IClient {
  const redisUrl = process.env.REDIS_URL as string;
  const redisClient = new Redis(redisUrl);

  async function connect(): Promise<void> {
    await redisClient.connect();
  }

  async function disconnect(): Promise<void> {
    await redisClient.disconnect();
  }

  async function setKey<T>(key: string, value: T): Promise<void> {
    await redisClient.set(key, JSON.stringify(value));
  }

  async function delKey(key: string): Promise<void> {
    await redisClient.del(key);
  }

  async function getValue<T>(key: string): Promise<T> {
    const value = await redisClient.get(key);
    return JSON.parse(String(value));
  }

  async function getKeys(pattern: string): Promise<string[]> {
    const keys = await redisClient.keys(pattern);
    return keys;
  }

  async function flushAllKeys(): Promise<void> {
    await redisClient.flushall();
  }

  async function getAllKeys(): Promise<string[]> {
    const pattern = "*";
    const allKeys = await getKeys(pattern);
    return allKeys;
  }

  return {
    connect,
    disconnect,
    setKey,
    delKey,
    getValue,
    getKeys,
    getAllKeys,
    flushAllKeys,
  };
}

export const client = createClient();
export default createClient;
