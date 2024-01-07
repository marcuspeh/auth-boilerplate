import CustomError from '../errors/customError';
import {errorCode} from '../errors/errorCode';
import passwordServiceHelper from './helper/passwordServiceHelper';
import rsaServiceHelper from './helper/rsaServiceHelper';
import User from '../entity/user';
import userDb from '../db/userDb';
import userService from './userService';

jest.mock('../db/userDb', () => ({}));
jest.mock('./helper/rsaServiceHelper', () => ({}));
jest.mock('./helper/passwordServiceHelper', () => ({}));

describe('register', () => {
  it('valid, registered', async () => {
    const name = 'name';
    const email = 'email';
    const encryptedPassword = 'encryptedPassword';
    const password = 'password';
    const passwordHash = 'passwordHash';
    const user = new User();
    user.name = name;
    user.email = email;

    userDb.getUserByEmail = jest.fn().mockResolvedValue(null);
    userDb.createUser = jest.fn().mockResolvedValue(user);
    rsaServiceHelper.decrypt = jest.fn().mockResolvedValue(password);
    passwordServiceHelper.checkPasswordRequirements = jest.fn();
    passwordServiceHelper.hashPassword = jest
      .fn()
      .mockResolvedValue(passwordHash);

    const result = await userService.register(name, email, encryptedPassword);

    expect(result).toBe(user);

    expect(userDb.getUserByEmail).toHaveBeenCalledWith(email);
    expect(userDb.createUser).toHaveBeenCalledWith(name, email, passwordHash);
    expect(rsaServiceHelper.decrypt).toHaveBeenCalledWith(encryptedPassword);
    expect(
      passwordServiceHelper.checkPasswordRequirements
    ).toHaveBeenCalledWith(password);
    expect(passwordServiceHelper.hashPassword).toHaveBeenCalledWith(password);
  });

  it('invalid, email exists', async () => {
    const name = 'name';
    const email = 'email';
    const encryptedPassword = 'encryptedPassword';
    const user = new User();

    userDb.getUserByEmail = jest.fn().mockResolvedValue(user);

    await expect(() =>
      userService.register(name, email, encryptedPassword)
    ).rejects.toThrow(
      new CustomError(errorCode.EMAIL_EXISTS, 'Email already exists')
    );

    expect(userDb.getUserByEmail).toHaveBeenCalledWith(email);
  });

  it('invalid, password requirement not met', async () => {
    const name = 'name';
    const email = 'email';
    const encryptedPassword = 'encryptedPassword';
    const password = '';
    const user = new User();
    user.name = name;
    user.email = email;

    userDb.getUserByEmail = jest.fn().mockResolvedValue(null);
    rsaServiceHelper.decrypt = jest.fn().mockResolvedValue(password);
    passwordServiceHelper.checkPasswordRequirements = jest.fn(() => {
      throw new CustomError(errorCode.PASSWORD_REQUIREMENT_NOT_MET);
    });

    await expect(() =>
      userService.register(name, email, encryptedPassword)
    ).rejects.toThrow(new CustomError(errorCode.PASSWORD_REQUIREMENT_NOT_MET));

    expect(userDb.getUserByEmail).toHaveBeenCalledWith(email);
    expect(rsaServiceHelper.decrypt).toHaveBeenCalledWith(encryptedPassword);
    expect(
      passwordServiceHelper.checkPasswordRequirements
    ).toHaveBeenCalledWith(password);
  });
});

describe('login', () => {
  it('valid, logged in', async () => {
    const email = 'email';
    const encryptedPassword = 'encryptedPassword';
    const password = 'password';
    const userPassword = 'userPassword';
    const user = new User();
    user.email = email;
    user.password = userPassword;

    userDb.getUserByEmail = jest.fn().mockResolvedValue(user);
    rsaServiceHelper.decrypt = jest.fn().mockResolvedValue(password);
    passwordServiceHelper.checkPassword = jest.fn();

    const result = await userService.login(email, encryptedPassword);

    expect(result).toBe(user);

    expect(userDb.getUserByEmail).toHaveBeenCalledWith(email);
    expect(rsaServiceHelper.decrypt).toHaveBeenCalledWith(encryptedPassword);
    expect(passwordServiceHelper.checkPassword).toHaveBeenCalledWith(
      password,
      userPassword
    );
  });

  it('invalid, user doesnt exists', async () => {
    const email = 'email';
    const encryptedPassword = 'encryptedPassword';

    userDb.getUserByEmail = jest.fn().mockResolvedValue(null);

    await expect(() =>
      userService.login(email, encryptedPassword)
    ).rejects.toThrow(
      new CustomError(
        errorCode.CREDENTIALS_INVALID,
        'User with email not found'
      )
    );

    expect(userDb.getUserByEmail).toHaveBeenCalledWith(email);
  });
});

describe('getUser', () => {
  it('valid, user is present', async () => {
    const user = new User();
    user.id = 'userId';

    userDb.getUserById = jest.fn().mockResolvedValue(user);

    const result = await userService.getUser(user.id);

    expect(result).toBe(user);

    expect(userDb.getUserById).toHaveBeenCalledWith(user.id);
  });

  it('invalid, user doesnt exists', async () => {
    const userId = 'userId';

    userDb.getUserById = jest.fn().mockResolvedValue(null);

    await expect(() => userService.getUser(userId)).rejects.toThrow(
      new CustomError(errorCode.USER_NOT_FOUND, 'User not found')
    );

    expect(userDb.getUserById).toHaveBeenCalledWith(userId);
  });
});

describe('updatePassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('valid,', async () => {
    const user = new User();
    user.id = 'userId';
    user.password = 'password';
    const originalPasswordHash = user.password;
    const originalPasswordEncrypted = 'originalPasswordEncrypted';
    const originalPasswordDecrypted = 'originalPasswordDecrypted';
    const newPasswordEncrypted = 'newPasswordEncrypted';
    const newPasswordDecrypted = 'newPasswordDecrypted';
    const newPasswordHash = 'newPasswordHash';

    userDb.getUserById = jest.fn().mockResolvedValue(user);
    rsaServiceHelper.decrypt = jest
      .fn()
      .mockResolvedValueOnce(originalPasswordDecrypted)
      .mockResolvedValueOnce(newPasswordDecrypted);
    passwordServiceHelper.checkPassword = jest.fn();
    passwordServiceHelper.checkPasswordRequirements = jest.fn();
    passwordServiceHelper.hashPassword = jest
      .fn()
      .mockResolvedValue(newPasswordHash);
    userDb.saveUser = jest.fn();

    const result = await userService.updatePassword(
      user.id,
      originalPasswordEncrypted,
      newPasswordEncrypted
    );

    expect(result).toBe(user);

    expect(userDb.getUserById).toHaveBeenCalledWith(user.id);
    expect(rsaServiceHelper.decrypt).toHaveBeenNthCalledWith(
      1,
      originalPasswordEncrypted
    );
    expect(passwordServiceHelper.checkPassword).toHaveBeenCalledWith(
      originalPasswordDecrypted,
      originalPasswordHash
    );
    expect(rsaServiceHelper.decrypt).toHaveBeenNthCalledWith(
      2,
      newPasswordEncrypted
    );
    expect(
      passwordServiceHelper.checkPasswordRequirements
    ).toHaveBeenCalledWith(newPasswordDecrypted);
    expect(passwordServiceHelper.hashPassword).toHaveBeenCalledWith(
      newPasswordDecrypted
    );
    expect(userDb.saveUser).toHaveBeenCalledWith(user);
  });

  it('invalid, user doesnt exists', async () => {
    const userId = 'userId';
    const originalPassword = 'originalPassword';
    const newPassword = 'newPassword';

    userDb.getUserById = jest.fn().mockResolvedValue(null);

    await expect(() =>
      userService.updatePassword(userId, originalPassword, newPassword)
    ).rejects.toThrow(
      new CustomError(errorCode.USER_NOT_FOUND, 'User not found')
    );

    expect(userDb.getUserById).toHaveBeenCalledWith(userId);
  });

  it('invalid, password requirement not met', async () => {
    const user = new User();
    user.id = 'userId';
    user.password = 'password';
    const originalPasswordHash = user.password;
    const originalPasswordEncrypted = 'originalPasswordEncrypted';
    const originalPasswordDecrypted = 'originalPasswordDecrypted';
    const newPasswordEncrypted = 'newPasswordEncrypted';
    const newPasswordDecrypted = 'newPasswordDecrypted';

    userDb.getUserById = jest.fn().mockResolvedValue(user);
    rsaServiceHelper.decrypt = jest
      .fn()
      .mockResolvedValueOnce(originalPasswordDecrypted)
      .mockResolvedValueOnce(newPasswordDecrypted);
    passwordServiceHelper.checkPassword = jest.fn();
    passwordServiceHelper.checkPasswordRequirements = jest.fn(() => {
      throw new CustomError(errorCode.PASSWORD_REQUIREMENT_NOT_MET);
    });

    await expect(() =>
      userService.updatePassword(
        user.id,
        originalPasswordEncrypted,
        newPasswordEncrypted
      )
    ).rejects.toThrow(new CustomError(errorCode.PASSWORD_REQUIREMENT_NOT_MET));

    expect(userDb.getUserById).toHaveBeenCalledWith(user.id);
    expect(rsaServiceHelper.decrypt).toHaveBeenNthCalledWith(
      1,
      originalPasswordEncrypted
    );
    expect(passwordServiceHelper.checkPassword).toHaveBeenCalledWith(
      originalPasswordDecrypted,
      originalPasswordHash
    );
    expect(rsaServiceHelper.decrypt).toHaveBeenNthCalledWith(
      2,
      newPasswordEncrypted
    );
    expect(
      passwordServiceHelper.checkPasswordRequirements
    ).toHaveBeenCalledWith(newPasswordDecrypted);
  });
});
