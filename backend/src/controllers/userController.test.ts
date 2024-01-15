import {Context} from 'koa';

import {
  forgetPasswordDTO,
  loginUserDTO,
  registerUserDTO,
  resetPasswordDTO,
  updatePasswordDTO,
} from './apiSchemas/userDTO';
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

describe('updatePassword', () => {
  let previousEnv: string | undefined = undefined;

  beforeAll(() => {
    previousEnv = process.env.ENVIRONMENT;
  });

  afterAll(() => {
    process.env.ENVIRONMENT = previousEnv;
  });

  it('valid, env is dev', async () => {
    process.env.ENVIRONMENT = 'dev';
    const originalPassword = 'originalPassword';
    const newPassword = 'newPassword';
    const jwtString = 'jwtString';
    const user = new User();
    user.id = 'userId';

    const request = {
      originalPassword: originalPassword,
      newPassword: newPassword,
    };
    const expectedBody = {
      message: 'Updated',
    };

    dtoValidator.inputValidate = jest.fn().mockResolvedValue(request);
    userService.updatePassword = jest.fn().mockResolvedValue(user);
    tokenService.invalidateToken = jest.fn();
    tokenService.generateUserToken = jest.fn().mockResolvedValue(jwtString);

    const context: unknown = {
      cookies: {
        set: jest.fn(),
      },
      request: {
        header: {
          userId: user.id,
        },
        body: request,
      },
    };
    await userController.updatePassword(context as Context);

    expect((context as Context).body).toStrictEqual(expectedBody);

    expect(dtoValidator.inputValidate).toHaveBeenCalledWith(
      updatePasswordDTO,
      request
    );
    expect(userService.updatePassword).toHaveBeenCalledWith(
      user.id,
      originalPassword,
      newPassword
    );
    expect(tokenService.invalidateToken).toHaveBeenCalledWith(
      user.id,
      TOKEN_TYPE.USER_TOKEN
    );
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
    const originalPassword = 'originalPassword';
    const newPassword = 'newPassword';
    const jwtString = 'jwtString';
    const user = new User();
    user.id = 'userId';

    const request = {
      originalPassword: originalPassword,
      newPassword: newPassword,
    };
    const expectedBody = {
      message: 'Updated',
    };

    dtoValidator.inputValidate = jest.fn().mockResolvedValue(request);
    userService.updatePassword = jest.fn().mockResolvedValue(user);
    tokenService.invalidateToken = jest.fn();
    tokenService.generateUserToken = jest.fn().mockResolvedValue(jwtString);

    const context: unknown = {
      cookies: {
        set: jest.fn(),
      },
      request: {
        header: {
          userId: user.id,
        },
        body: request,
      },
    };
    await userController.updatePassword(context as Context);

    expect((context as Context).body).toStrictEqual(expectedBody);

    expect(dtoValidator.inputValidate).toHaveBeenCalledWith(
      updatePasswordDTO,
      request
    );
    expect(userService.updatePassword).toHaveBeenCalledWith(
      user.id,
      originalPassword,
      newPassword
    );
    expect(tokenService.invalidateToken).toHaveBeenCalledWith(
      user.id,
      TOKEN_TYPE.USER_TOKEN
    );
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

describe('forgetPassword', () => {
  let previousEnv: string | undefined = undefined;

  beforeAll(() => {
    previousEnv = process.env.ENVIRONMENT;
  });

  afterAll(() => {
    process.env.ENVIRONMENT = previousEnv;
  });

  it('valid, env is dev', async () => {
    process.env.ENVIRONMENT = 'dev';
    const jwtString = 'jwtString';
    const user = new User();
    user.email = 'email';

    const request = {
      email: user.email,
    };
    const expectedBody = {
      message: 'Email sent',
      code: jwtString,
    };

    dtoValidator.inputValidate = jest.fn().mockResolvedValue(request);
    userService.getUserByEmail = jest.fn().mockResolvedValue(user);
    tokenService.generateForgetPasswordToken = jest
      .fn()
      .mockResolvedValue(jwtString);

    const context: unknown = {
      request: {
        body: request,
      },
    };
    await userController.forgetPassword(context as Context);

    expect((context as Context).body).toStrictEqual(expectedBody);

    expect(dtoValidator.inputValidate).toHaveBeenCalledWith(
      forgetPasswordDTO,
      request
    );
    expect(userService.getUserByEmail).toHaveBeenCalledWith(user.email);
    expect(tokenService.generateForgetPasswordToken).toHaveBeenCalledWith(user);
  });

  it('valid, env is not dev', async () => {
    process.env.ENVIRONMENT = 'other';
    const jwtString = 'jwtString';
    const user = new User();
    user.email = 'email';

    const request = {
      email: user.email,
    };
    const expectedBody = {
      message: 'Email sent',
    };

    dtoValidator.inputValidate = jest.fn().mockResolvedValue(request);
    userService.getUserByEmail = jest.fn().mockResolvedValue(user);
    tokenService.generateForgetPasswordToken = jest
      .fn()
      .mockResolvedValue(jwtString);

    const context: unknown = {
      request: {
        body: request,
      },
    };
    await userController.forgetPassword(context as Context);

    expect((context as Context).body).toStrictEqual(expectedBody);

    expect(dtoValidator.inputValidate).toHaveBeenCalledWith(
      forgetPasswordDTO,
      request
    );
    expect(userService.getUserByEmail).toHaveBeenCalledWith(user.email);
    expect(tokenService.generateForgetPasswordToken).toHaveBeenCalledWith(user);
  });
});

describe('resetPassword', () => {
  it('valid', async () => {
    const user = new User();
    user.id = 'userId';
    const token = 'token';
    const newPassword = 'newPassword';

    const request = {
      newPassword: newPassword,
    };
    const expectedBody = {
      message: 'Updated',
    };

    dtoValidator.inputValidate = jest.fn().mockResolvedValue(request);
    tokenService.verifyResetPasswordToken = jest.fn().mockResolvedValue(user);
    userService.resetPassword = jest.fn();
    tokenService.invalidateToken = jest.fn();

    const context: unknown = {
      params: {
        token: token,
      },
      request: {
        body: request,
      },
    };
    await userController.resetPassword(context as Context);

    expect((context as Context).body).toStrictEqual(expectedBody);

    expect(dtoValidator.inputValidate).toHaveBeenCalledWith(
      resetPasswordDTO,
      request
    );
    expect(tokenService.verifyResetPasswordToken).toHaveBeenCalledWith(token);
    expect(userService.resetPassword).toHaveBeenCalledWith(
      user.id,
      newPassword
    );
    expect(tokenService.invalidateToken).toHaveBeenNthCalledWith(
      1,
      user.id,
      TOKEN_TYPE.USER_TOKEN
    );
    expect(tokenService.invalidateToken).toHaveBeenNthCalledWith(
      2,
      user.id,
      TOKEN_TYPE.FORGET_PASSWORD
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
