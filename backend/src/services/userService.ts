import {UserDb} from '../db/userDb';
import User from '../entity/user';
import CustomError from '../errors/customError';
import {errorCode} from '../errors/errorCode';
import passwordServiceHelper from './helper/passwordServiceHelper';
import rsaServiceHelper from './helper/rsaServiceHelper';

export default class UserService {
  userDb: UserDb = new UserDb();

  public async register(
    name: string,
    email: string,
    encryptedPassword: string
  ): Promise<User> {
    var user: User = await this.userDb.getUserByEmail(email);

    if (user) {
      throw new CustomError(errorCode.EMAIL_EXISTS, 'Email already exists');
    }

    const password: string = await rsaServiceHelper.decrypt(encryptedPassword);
    const passwordHash: string =
      await passwordServiceHelper.hashPassword(password);
    user = await this.userDb.createUser(name, email, passwordHash);
    user.password = undefined;

    return user;
  }

  public async login(email: string, encryptedPassword: string): Promise<User> {
    const user: User = await this.userDb.getUserByEmail(email);

    if (!user) {
      throw new CustomError(
        errorCode.CREDENTIALS_INVALID,
        'User with email not found'
      );

    const password: string = await rsaServiceHelper.decrypt(encryptedPassword);
    await passwordServiceHelper.checkPassword(password, user.password);
    user.password = undefined;

    return user;
  }

  public async getUser(userId: string): Promise<User> {
    const user: User = await this.userDb.getUserById(userId);

    if (!user) {
      throw new CustomError(errorCode.USER_NOT_FOUND, 'User not found');
    }

    return user;
  }
}
