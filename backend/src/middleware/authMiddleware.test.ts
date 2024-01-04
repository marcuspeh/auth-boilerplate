import auth from './authMiddleware';
import constant from '../constant';
import {Context} from 'koa';
import CustomError from '../errors/customError';
import {errorCode} from '../errors/errorCode';
import jwt from 'jsonwebtoken';
import Token from '../entity/token';
import {TOKEN_TYPE} from '../enum/tokenType';
import tokenService from '../services/tokenService';
import User from '../entity/user';

jest.mock('../services/tokenService', () => ({}));

describe('auth middleware', () => {
  let previousJwtToken: string | undefined = undefined;
  let mockContext = {
    cookies: {
      get: jest.fn(),
    },
    request: {
      header: {
        tonic: '',
      },
    },
  };

  beforeAll(() => {
    previousJwtToken = process.env.JWT_SECRET;
  });

  afterAll(() => {
    process.env.JWT_SECRET = previousJwtToken;
  });

  beforeEach(() => {
    mockContext = {
      cookies: {
        get: jest.fn(),
      },
      request: {
        header: {
          tonic: '',
        },
      },
    };
  });

  it('valid, JWT and CSRF are valid with JWT secret', async () => {
    const jwtSecret = 'secret';
    process.env.JWT_SECRET = jwtSecret;

    const tokenString = 'token';
    mockContext.cookies.get.mockReturnValue(tokenString);
    mockContext.request.header.tonic = tokenString;

    const jwtPayload = {
      userId: 'userId',
      tokenId: 'tokenId',
      expiryDate: new Date(),
    };
    const token = new Token();
    token.user = new User();
    token.expiryDate = new Date();
    const tokenType = TOKEN_TYPE.USER_TOKEN;

    jwt.verify = jest.fn().mockResolvedValue(jwtPayload);
    tokenService.verifyToken = jest.fn().mockResolvedValue(token);

    const mockNext = jest.fn();
    await auth(mockContext as unknown as Context, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockContext.cookies.get).toHaveBeenCalledWith(
      constant.JWT_TOKEN_LABEL
    );
    expect(jwt.verify).toHaveBeenCalledWith(tokenString, jwtSecret);
    expect(tokenService.verifyToken).toHaveBeenCalledWith(
      jwtPayload.tokenId,
      jwtPayload.userId,
      tokenType
    );
  });

  it('valid, JWT and CSRF are valid without JWT secret', async () => {
    process.env.JWT_SECRET = '';
    const tokenString = 'token';
    mockContext.cookies.get.mockReturnValue(tokenString);
    mockContext.request.header.tonic = tokenString;

    const jwtPayload = {
      userId: 'userId',
      tokenId: 'tokenId',
      expiryDate: new Date(),
    };
    const token = new Token();
    token.user = new User();
    token.expiryDate = new Date();
    const tokenType = TOKEN_TYPE.USER_TOKEN;

    jwt.verify = jest.fn().mockResolvedValue(jwtPayload);
    tokenService.verifyToken = jest.fn().mockResolvedValue(token);

    const mockNext = jest.fn();
    await auth(mockContext as unknown as Context, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockContext.cookies.get).toHaveBeenCalledWith(
      constant.JWT_TOKEN_LABEL
    );
    expect(jwt.verify).toHaveBeenCalledWith(tokenString, constant.EMPTY_STRING);
    expect(tokenService.verifyToken).toHaveBeenCalledWith(
      jwtPayload.tokenId,
      jwtPayload.userId,
      tokenType
    );
  });

  it('invalid, CSRF missing', async () => {
    const tokenString = 'token';
    mockContext.cookies.get.mockReturnValue(tokenString);

    const mockNext = jest.fn();
    await expect(() =>
      auth(mockContext as unknown as Context, mockNext)
    ).rejects.toThrow(new CustomError(errorCode.CSRF_DOES_NOT_EXISTS));

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockContext.cookies.get).toHaveBeenCalledWith(
      constant.JWT_TOKEN_LABEL
    );
  });

  it('invalid, CSRF mismatch', async () => {
    const tokenString = 'token';
    mockContext.cookies.get.mockReturnValue(tokenString);
    mockContext.request.header.tonic = 'invalid_token';

    const mockNext = jest.fn();
    await expect(() =>
      auth(mockContext as unknown as Context, mockNext)
    ).rejects.toThrow(new CustomError(errorCode.CSRF_MISMATCH));

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockContext.cookies.get).toHaveBeenCalledWith(
      constant.JWT_TOKEN_LABEL
    );
  });

  it('invalid, CSRF mismatch', async () => {
    mockContext.cookies.get.mockReturnValue('');

    const mockNext = jest.fn();
    await expect(() =>
      auth(mockContext as unknown as Context, mockNext)
    ).rejects.toThrow(new CustomError(errorCode.TOKEN_DOES_NOT_EXISTS));

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockContext.cookies.get).toHaveBeenCalledWith(
      constant.JWT_TOKEN_LABEL
    );
  });

  it('invalid, JWT modified', async () => {
    const jwtSecret = 'secret';
    process.env.JWT_SECRET = jwtSecret;

    const tokenString = 'token';
    mockContext.cookies.get.mockReturnValue(tokenString);
    mockContext.request.header.tonic = tokenString;

    jwt.verify = jest.fn().mockRejectedValue(tokenString);

    const mockNext = jest.fn();
    await expect(() =>
      auth(mockContext as unknown as Context, mockNext)
    ).rejects.toThrow(new CustomError(errorCode.TOKEN_INVALID));

    expect(mockNext).not.toHaveBeenCalled();
    expect(mockContext.cookies.get).toHaveBeenCalledWith(
      constant.JWT_TOKEN_LABEL
    );
    expect(jwt.verify).toHaveBeenCalledWith(tokenString, jwtSecret);
  });
});
