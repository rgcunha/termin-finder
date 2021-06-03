import createRedisClient from "../clients/redis";

export type User = {
  id: string;
  chatId: string;
};

export type UserService = {
  addUser(user: User): Promise<void>;
  getUser(userId: string): Promise<User>;
  delUser(userId: string): Promise<void>;
  getUsers(): Promise<User[]>;
  delUsers(): Promise<void>;
};

function createUserService(): UserService {
  const redisClient = createRedisClient();
  const nsApplication = "termin-finder";
  const nsUser = `${nsApplication}:user`;

  async function addUser(user: User): Promise<void> {
    const key = `${nsUser}:${user.id}`;
    await redisClient.setKey<User>(key, user);
  }

  async function getUser(userId: string): Promise<User> {
    const key = `${nsUser}:${userId}`;
    const user = await redisClient.getValue<User>(key);
    return user;
  }

  async function delUser(userId: string): Promise<void> {
    const key = `${nsUser}:${userId}`;
    await redisClient.delKey(key);
  }

  async function getUserKeys(): Promise<string[]> {
    const pattern = `${nsUser}:*`;
    const userKeys = await redisClient.getKeys(pattern);
    return userKeys;
  }

  async function getUsers(): Promise<User[]> {
    const keys = await getUserKeys();
    const users = await Promise.all(
      keys.map(async (key) => {
        const user = await redisClient.getValue<User>(key);
        return user;
      })
    );
    return users;
  }

  async function delUsers(): Promise<void> {
    const keys = await getUserKeys();
    await Promise.all(
      keys.map(async (key) => {
        await redisClient.delKey(key);
      })
    );
  }

  return {
    addUser,
    getUser,
    delUser,
    getUsers,
    delUsers,
  };
}

export const userService = createUserService();
export default createUserService;
