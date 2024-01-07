import CustomError from '../errors/customError';
import {errorCode} from '../errors/errorCode';
import passwordServiceHelper from './helper/passwordServiceHelper';
import rsaServiceHelper from './helper/rsaServiceHelper';
import User from '../entity/user';
import userDb from '../db/userDb';

async function register(
  name: string,
  email: string,
  encryptedPassword: string
): Promise<User> {
  let user: User | null = await userDb.getUserByEmail(email);

  if (user) {
    throw new CustomError(errorCode.EMAIL_EXISTS, 'Email already exists');
  }

  const passwordHash: string = await decryptAndHashPassword(encryptedPassword);
  user = await userDb.createUser(name, email, passwordHash);
  user.password = '';

  return user;
}

async function decryptAndHashPassword(
  encryptedPassword: string
): Promise<string> {
  const password: string = await rsaServiceHelper.decrypt(encryptedPassword);
  passwordServiceHelper.checkPasswordRequirements(password);
  return passwordServiceHelper.hashPassword(password);
}

async function login(email: string, encryptedPassword: string): Promise<User> {
  const user: User | null = await userDb.getUserByEmail(email);

  if (!user) {
    throw new CustomError(
      errorCode.CREDENTIALS_INVALID,
      'User with email not found'
    );
  }

  await decryptAndCheckPassword(encryptedPassword, user.password);
  user.password = '';
  return user;
}

async function decryptAndCheckPassword(
  encryptedPassword: string,
  hashedPassword: string
): Promise<void> {
  const password: string = await rsaServiceHelper.decrypt(encryptedPassword);
  await passwordServiceHelper.checkPassword(password, hashedPassword);
}

async function getUser(userId: string): Promise<User> {
  const user: User | null = await userDb.getUserById(userId);

  if (!user) {
    throw new CustomError(errorCode.USER_NOT_FOUND, 'User not found');
  }

  return user;
}

async function updatePassword(
  userId: string,
  originalPassword: string,
  newPassword: string
): Promise<User> {
  const user: User = await getUser(userId);
  await decryptAndCheckPassword(originalPassword, user.password);

  const passwordHash: string = await decryptAndHashPassword(newPassword);
  user.password = passwordHash;
  await userDb.saveUser(user);

  return user;
}

export default {
  register,
  login,
  getUser,
  updatePassword,
};
