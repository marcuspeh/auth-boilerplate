import jwt from 'jsonwebtoken';

import constant from '../constant';
import CustomError from '../errors/customError';
import {errorCode} from '../errors/errorCode';
import jwtServiceHelper from './helper/jwtServiceHelper';
import Token from '../entity/token';
import {TOKEN_TYPE} from '../enum/tokenType';
import tokenDb from '../db/tokenDb';
import tokenService from './tokenService';
import tokenServiceHelper from './helper/tokenServiceHelper';
import User from '../entity/user';

jest.mock('../db/tokenDb', () => ({}));
jest.mock('./helper/jwtServiceHelper', () => ({}));
jest.mock('./helper/tokenServiceHelper', () => ({}));

describe('generateUserToken', () => {
  let previousTokenExpiry: string | undefined = undefined;

  beforeAll(() => {
    previousTokenExpiry = process.env.MAX_USER_TOKEN_VALIDITY_SECONDS;
  });

  afterAll(() => {
    process.env.MAX_USER_TOKEN_VALIDITY_SECONDS = previousTokenExpiry;
  });

  it('valid, generated user token with env', async () => {
    const user = new User();
    user.id = 'userId';
    const token = new Token();
    token.user = user;
    const expiry = 5;
    const tokenString = 'tokenString';
    process.env.MAX_USER_TOKEN_VALIDITY_SECONDS = '5';

    tokenDb.invalidateToken = jest.fn();
    tokenDb.createToken = jest.fn().mockResolvedValue(token);
    jwtServiceHelper.signJwtToken = jest.fn().mockResolvedValue(tokenString);

    const userToken = await tokenService.generateUserToken(user);

    expect(userToken).toBe(tokenString);

    expect(tokenDb.invalidateToken).toHaveBeenCalledWith(
      user.id,
      TOKEN_TYPE.USER_TOKEN
    );
    expect(tokenDb.createToken).toHaveBeenCalledWith(
      user,
      TOKEN_TYPE.USER_TOKEN,
      expiry
    );
  });

  it('valid, generated user token with env', async () => {
    const user = new User();
    user.id = 'userId';
    const token = new Token();
    token.user = user;
    const tokenString = 'tokenString';
    process.env.MAX_USER_TOKEN_VALIDITY_SECONDS = undefined;

    tokenDb.invalidateToken = jest.fn();
    tokenDb.createToken = jest.fn().mockResolvedValue(token);
    jwtServiceHelper.signJwtToken = jest.fn().mockResolvedValue(tokenString);

    const userToken = await tokenService.generateUserToken(user);

    expect(userToken).toBe(tokenString);

    expect(tokenDb.invalidateToken).toHaveBeenCalledWith(
      user.id,
      TOKEN_TYPE.USER_TOKEN
    );
    expect(tokenDb.createToken).toHaveBeenCalledWith(
      user,
      TOKEN_TYPE.USER_TOKEN,
      constant.DEFAULT_TOKEN_EXPIRY_SECONDS
    );
  });
});

describe('generateForgetPasswordToken', () => {
  let previousTokenExpiry: string | undefined = undefined;

  beforeAll(() => {
    previousTokenExpiry =
      process.env.MAX_FORGET_PASSWORD_TOKEN_VALIDITY_SECONDS;
  });

  afterAll(() => {
    process.env.MAX_FORGET_PASSWORD_TOKEN_VALIDITY_SECONDS =
      previousTokenExpiry;
  });

  it('valid, generated forget password token with env', async () => {
    const user = new User();
    user.id = 'userId';
    const token = new Token();
    token.user = user;
    const expiry = 5;
    const tokenString = 'tokenString';
    process.env.MAX_FORGET_PASSWORD_TOKEN_VALIDITY_SECONDS = '5';

    tokenDb.invalidateToken = jest.fn();
    tokenDb.createToken = jest.fn().mockResolvedValue(token);
    jwtServiceHelper.signJwtToken = jest.fn().mockResolvedValue(tokenString);

    const userToken = await tokenService.generateForgetPasswordToken(user);

    expect(userToken).toBe(tokenString);

    expect(tokenDb.invalidateToken).toHaveBeenCalledWith(
      user.id,
      TOKEN_TYPE.FORGET_PASSWORD
    );
    expect(tokenDb.createToken).toHaveBeenCalledWith(
      user,
      TOKEN_TYPE.FORGET_PASSWORD,
      expiry
    );
  });

  it('valid, generated user token with env', async () => {
    const user = new User();
    user.id = 'userId';
    const token = new Token();
    token.user = user;
    const tokenString = 'tokenString';
    process.env.MAX_FORGET_PASSWORD_TOKEN_VALIDITY_SECONDS = undefined;

    tokenDb.invalidateToken = jest.fn();
    tokenDb.createToken = jest.fn().mockResolvedValue(token);
    jwtServiceHelper.signJwtToken = jest.fn().mockResolvedValue(tokenString);

    const userToken = await tokenService.generateForgetPasswordToken(user);

    expect(userToken).toBe(tokenString);

    expect(tokenDb.invalidateToken).toHaveBeenCalledWith(
      user.id,
      TOKEN_TYPE.FORGET_PASSWORD
    );
    expect(tokenDb.createToken).toHaveBeenCalledWith(
      user,
      TOKEN_TYPE.FORGET_PASSWORD,
      constant.DEFAULT_TOKEN_EXPIRY_SECONDS
    );
  });
});

describe('verifyToken', () => {
  it('valid', async () => {
    const user = new User();
    user.id = 'userId';
    const token = new Token();
    token.id = 'tokenId';
    token.user = user;
    token.type = TOKEN_TYPE.USER_TOKEN;

    tokenDb.getToken = jest.fn().mockResolvedValue(token);
    tokenServiceHelper.isValid = jest.fn();

    const userToken = await tokenService.verifyToken(
      token.id,
      user.id,
      token.type
    );

    expect(userToken).toBe(token);

    expect(tokenDb.getToken).toHaveBeenCalledWith(token.id);
    expect(tokenServiceHelper.isValid).toHaveBeenCalledWith(
      token,
      token.type,
      true
    );
  });

  it('invalid, token not found', async () => {
    const userId = 'userId';
    const tokenId = 'tokenId';
    const tokenType = TOKEN_TYPE.USER_TOKEN;

    tokenDb.getToken = jest.fn().mockResolvedValue(null);

    await expect(() =>
      tokenService.verifyToken(tokenId, userId, tokenType)
    ).rejects.toThrow(new CustomError(errorCode.TOKEN_DOES_NOT_EXISTS));

    expect(tokenDb.getToken).toHaveBeenCalledWith(tokenId);
  });

  it('invalid, userid mismatch', async () => {
    const user = new User();
    user.id = 'userId';
    const token = new Token();
    token.id = 'tokenId';
    token.user = new User();
    token.type = TOKEN_TYPE.USER_TOKEN;

    tokenDb.getToken = jest.fn().mockResolvedValue(token);

    await expect(() =>
      tokenService.verifyToken(token.id, user.id, token.type)
    ).rejects.toThrow(new CustomError(errorCode.TOKEN_INVALID));

    expect(tokenDb.getToken).toHaveBeenCalledWith(token.id);
  });
});

describe('invalidateToken', () => {
  it('valid, invalidated user token', async () => {
    const userId = 'userId';
    const tokenType = TOKEN_TYPE.USER_TOKEN;

    tokenDb.invalidateToken = jest.fn();

    const userToken = await tokenService.invalidateToken(userId, tokenType);

    expect(userToken).toBe(undefined);

    expect(tokenDb.invalidateToken).toHaveBeenCalledWith(userId, tokenType);
  });
});

describe('invalidateExpiredToken', () => {
  it('valid, invalidated expired token', async () => {
    tokenDb.invalidateExpiredToken = jest.fn();

    const userToken = await tokenService.invalidateExpiredToken();

    expect(userToken).toBe(undefined);

    expect(tokenDb.invalidateExpiredToken).toHaveBeenCalledWith();
  });
});

describe('verifyResetPasswordToken', () => {
  let previousJwtToken: string | undefined = undefined;

  beforeAll(() => {
    previousJwtToken = process.env.JWT_SECRET;
  });

  afterAll(() => {
    process.env.JWT_SECRET = previousJwtToken;
  });

  it('valid', async () => {
    const jwtSecret = 'secret';
    process.env.JWT_SECRET = jwtSecret;

    const user = new User();
    user.id = 'userId';
    const token = new Token();
    token.id = 'tokenId';
    token.user = user;
    token.type = TOKEN_TYPE.FORGET_PASSWORD;
    const tokenString = 'tokenString';
    const jwtPayload = {
      userId: 'userId',
      tokenId: 'tokenId',
      expiryDate: new Date(),
    };

    tokenDb.getToken = jest.fn().mockResolvedValue(token);
    jwt.verify = jest.fn().mockResolvedValue(jwtPayload);
    tokenServiceHelper.isValid = jest.fn();
    const result = await tokenService.verifyResetPasswordToken(tokenString);

    expect(result).toBe(user);

    expect(tokenDb.getToken).toHaveBeenCalledWith(token.id);
    expect(tokenServiceHelper.isValid).toHaveBeenCalledWith(
      token,
      token.type,
      true
    );
  });

  it('invalid, token not found', async () => {
    const userId = 'userId';
    const tokenId = 'tokenId';
    const tokenType = TOKEN_TYPE.FORGET_PASSWORD;

    tokenDb.getToken = jest.fn().mockResolvedValue(null);

    await expect(() =>
      tokenService.verifyToken(tokenId, userId, tokenType)
    ).rejects.toThrow(new CustomError(errorCode.TOKEN_DOES_NOT_EXISTS));

    expect(tokenDb.getToken).toHaveBeenCalledWith(tokenId);
  });

  it('invalid, userid mismatch', async () => {
    const user = new User();
    user.id = 'userId';
    const token = new Token();
    token.id = 'tokenId';
    token.user = new User();
    token.type = TOKEN_TYPE.USER_TOKEN;
    const jwtPayload = {
      userId: 'userId',
      tokenId: 'tokenId',
      expiryDate: new Date(),
    };

    tokenDb.getToken = jest.fn().mockResolvedValue(token);
    jwt.verify = jest.fn().mockResolvedValue(jwtPayload);

    await expect(() =>
      tokenService.verifyToken(token.id, user.id, token.type)
    ).rejects.toThrow(new CustomError(errorCode.TOKEN_INVALID));

    expect(tokenDb.getToken).toHaveBeenCalledWith(token.id);
  });
});
