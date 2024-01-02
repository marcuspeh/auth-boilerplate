import {dataSource} from '../data-source';
import User from '../entity/user';

const userRepo = dataSource.getRepository(User);

async function getUserByEmail(email: string): Promise<User | null> {
  const user: User | null = await userRepo
    .createQueryBuilder('user')
    .where('user.email = :email', {email: email})
    .getOne();

  return user;
}

async function getUserById(userId: string): Promise<User | null> {
  const user: User | null = await userRepo
    .createQueryBuilder('user')
    .where('user.id = :id', {id: userId})
    .getOne();

  return user;
}

async function createUser(
  name: string,
  email: string,
  passwordHash: string
): Promise<User> {
  const user: User = await userRepo.create({
    name: name,
    email: email,
    password: passwordHash,
  });

  const savedUser: User = await userRepo.save(user);
  return savedUser;
}

async function saveUser(user: User): Promise<User> {
  const savedUser: User = await userRepo.save(user);
  return savedUser;
}

export default {
  getUserByEmail,
  getUserById,
  createUser,
  saveUser,
};
