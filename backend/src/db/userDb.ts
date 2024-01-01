import {dataSource} from '../data-source';
import User from '../entity/user';

export interface IUserDb {
  getUserByEmail: (email: string) => Promise<User | null>;
  getUserById: (userId: string) => Promise<User | null>;
  createUser: (
    name: string,
    email: string,
    passwordHash: string
  ) => Promise<User>;
  saveUser: (user: User) => Promise<User>;
}

export class UserDb implements IUserDb {
  userRepo = dataSource.getRepository(User);

  public async getUserByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', {email: email})
      .getOne();

    return user;
  }

  public async getUserById(userId: string): Promise<User | null> {
    const user: User | null = await this.userRepo
      .createQueryBuilder('user')
      .where('user.id = :id', {id: userId})
      .getOne();

    return user;
  }

  public async createUser(
    name: string,
    email: string,
    passwordHash: string
  ): Promise<User> {
    const user: User = await this.userRepo.create({
      name: name,
      email: email,
      password: passwordHash,
    });

    const savedUser: User = await this.userRepo.save(user);
    return savedUser;
  }

  public async saveUser(user: User): Promise<User> {
    const savedUser: User = await this.userRepo.save(user);
    return savedUser;
  }
}
