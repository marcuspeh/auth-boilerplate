import {Context} from 'koa';

import {loginUserDTO, registerUserDTO} from './apiSchemas/userDTO';
import constant from '../constant';
import dtoValidator from './helper/dtoValidator';
import {TOKEN_TYPE} from '../enum/tokenType';
import tokenService from '../services/tokenService';
import User from '../entity/user';
import userController from './userController';
import userService from '../services/userService';

jest.mock('./helper/dtoValidator', () => ({}));
jest.mock('../services/userService', () => ({}));
jest.mock('../services/tokenService', () => ({}));

describe('register', () => {
  it('valid', async () => {
    const user: User = new User();
    user.name = 'name';
    user.email = 'email';
    user.password = 'password';

    const request = {
      name: user.name,
      email: user.email,
      password: user.password,
    };
    const expectedBody = {
      user: {
        name: user.name,
        email: user.email,
      },
    };

    dtoValidator.inputValidate = jest.fn().mockResolvedValue(request);
    userService.register = jest.fn().mockResolvedValue(user);

    const context: unknown = {
      request: {
        body: request,
      },
    };
    await userController.register(context as Context);

    expect((context as Context).body).toStrictEqual(expectedBody);

    expect(dtoValidator.inputValidate).toHaveBeenCalledWith(
      registerUserDTO,
      request
    );
    expect(userService.register).toHaveBeenCalledWith(
      user.name,
      user.email,
      user.password
    );
  });
});

describe('login', () => {
  let previousEnv: string | undefined = undefined;

  beforeAll(() => {
    previousEnv = process.env.ENVIRONMENT;
  });

  afterAll(() => {
    process.env.ENVIRONMENT = previousEnv;
  });

  it('valid, env is dev', async () => {
    process.env.ENVIRONMENT = 'dev';
    const user: User = new User();
    user.name = 'name';
    user.email = 'email';
    user.password = 'password';
    const jwtString = 'jwtString';

    const request = {
      email: user.email,
      password: user.password,
    };
    const expectedBody = {
      user: {
        name: user.name,
        email: user.email,
      },
    };

    dtoValidator.inputValidate = jest.fn().mockResolvedValue(request);
    userService.login = jest.fn().mockResolvedValue(user);
    tokenService.generateUserToken = jest.fn().mockResolvedValue(jwtString);

    const context: unknown = {
      cookies: {
        set: jest.fn(),
      },
      request: {
        body: request,
      },
    };
    await userController.login(context as Context);

    expect((context as Context).body).toStrictEqual(expectedBody);

    expect(dtoValidator.inputValidate).toHaveBeenCalledWith(
      loginUserDTO,
      request
    );
    expect(userService.login).toHaveBeenCalledWith(user.email, user.password);
    expect(tokenService.generateUserToken).toHaveBeenCalledWith(user);
    expect((context as Context).cookies.set).toHaveBeenCalledWith(
      constant.JWT_TOKEN_LABEL,
      jwtString,
      {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      }
    );
  });

  it('valid, env is not dev', async () => {
    process.env.ENVIRONMENT = 'other';
    const user: User = new User();
    user.name = 'name';
    user.email = 'email';
    user.password = 'password';
    const jwtString = 'jwtString';

    const request = {
      email: user.email,
      password: user.password,
    };
    const expectedBody = {
      user: {
        name: user.name,
        email: user.email,
      },
    };

    dtoValidator.inputValidate = jest.fn().mockResolvedValue(request);
    userService.login = jest.fn().mockResolvedValue(user);
    tokenService.generateUserToken = jest.fn().mockResolvedValue(jwtString);

    const context: unknown = {
      cookies: {
        set: jest.fn(),
      },
      request: {
        body: request,
      },
    };
    await userController.login(context as Context);

    expect((context as Context).body).toStrictEqual(expectedBody);

    expect(dtoValidator.inputValidate).toHaveBeenCalledWith(
      loginUserDTO,
      request
    );
    expect(userService.login).toHaveBeenCalledWith(user.email, user.password);
    expect(tokenService.generateUserToken).toHaveBeenCalledWith(user);
    expect((context as Context).cookies.set).toHaveBeenCalledWith(
      constant.JWT_TOKEN_LABEL,
      jwtString,
      {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      }
    );
  });
});

describe('logout', () => {
  it('valid', async () => {
    const userId = 'userid';
    const expectedBody = {
      message: 'Goodbye',
    };

    tokenService.invalidateToken = jest.fn();

    const context: unknown = {
      cookies: {
        set: jest.fn(),
      },
      request: {
        header: {
          userId: userId,
        },
      },
    };
    await userController.logout(context as Context);

    expect((context as Context).body).toStrictEqual(expectedBody);

    expect(tokenService.invalidateToken).toHaveBeenCalledWith(
      userId,
      TOKEN_TYPE.USER_TOKEN
    );
    expect((context as Context).cookies.set).toHaveBeenCalledWith(
      constant.JWT_TOKEN_LABEL,
      undefined
    );
  });
});

describe('checkAuthentication', () => {
  it('valid', async () => {
    const expectedBody = {
      message: 'Authenticated',
    };

    const context: unknown = {};
    await userController.checkAuthentication(context as Context);

    expect((context as Context).body).toStrictEqual(expectedBody);
  });
});
