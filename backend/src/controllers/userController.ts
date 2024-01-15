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
import userService from '../services/userService';

async function register(ctx: Context) {
  const apiDto = await dtoValidator.inputValidate(
    registerUserDTO,
    ctx.request.body
  );
  const user: User = await userService.register(
    apiDto.name,
    apiDto.email,
    apiDto.password
  );

  ctx.body = {
    user: {
      name: user.name,
      email: user.email,
    },
  };
}

async function login(ctx: Context) {
  const apiDto = await dtoValidator.inputValidate(
    loginUserDTO,
    ctx.request.body
  );
  const user: User = await userService.login(apiDto.email, apiDto.password);
  const jwtUserToken: string = await tokenService.generateUserToken(user);

  ctx.cookies.set(constant.JWT_TOKEN_LABEL, jwtUserToken, {
    httpOnly: true,
    secure: process.env.ENVIRONMENT !== 'dev',
    sameSite: 'lax',
  });

  ctx.body = {
    user: {
      name: user.name,
      email: user.email,
    },
  };
}

async function logout(ctx: Context) {
  const userId: string =
    ctx.request?.header?.userId?.toString() || constant.EMPTY_STRING;

  await tokenService.invalidateToken(userId, TOKEN_TYPE.USER_TOKEN);

  ctx.cookies.set(constant.JWT_TOKEN_LABEL, undefined);
  ctx.body = {
    message: 'Goodbye',
  };
}

async function updatePassword(ctx: Context) {
  const apiDto = await dtoValidator.inputValidate(
    updatePasswordDTO,
    ctx.request.body
  );

  const userId: string =
    ctx.request?.header?.userId?.toString() || constant.EMPTY_STRING;
  const user: User = await userService.updatePassword(
    userId,
    apiDto.originalPassword,
    apiDto.newPassword
  );

  await tokenService.invalidateToken(userId, TOKEN_TYPE.USER_TOKEN);
  const jwtUserToken: string = await tokenService.generateUserToken(user);

  ctx.cookies.set(constant.JWT_TOKEN_LABEL, jwtUserToken, {
    httpOnly: true,
    secure: process.env.ENVIRONMENT !== 'dev',
    sameSite: 'lax',
  });
  ctx.body = {
    message: 'Updated',
  };
}

async function forgetPassword(ctx: Context) {
  const apiDto = await dtoValidator.inputValidate(
    forgetPasswordDTO,
    ctx.request.body
  );

  const user: User = await userService.getUserByEmail(apiDto.email);
  const jwtForgetPasswordToken: string =
    await tokenService.generateForgetPasswordToken(user);

  if (process.env.ENVIRONMENT !== 'dev') {
    ctx.body = {
      message: 'Email sent',
    };
    return;
  }

  // Need to send out email with jwtForgetPasswordToken
  // TODO: Send email
  ctx.body = {
    message: 'Email sent',
    code: jwtForgetPasswordToken,
  };
}

async function resetPassword(ctx: Context) {
  const apiDto = await dtoValidator.inputValidate(
    resetPasswordDTO,
    ctx.request.body
  );

  const user = await tokenService.verifyResetPasswordToken(ctx.params.token);
  await userService.resetPassword(user.id, apiDto.newPassword);
  await tokenService.invalidateToken(user.id, TOKEN_TYPE.USER_TOKEN);
  await tokenService.invalidateToken(user.id, TOKEN_TYPE.FORGET_PASSWORD);

  ctx.body = {
    message: 'Updated',
  };
}

async function checkAuthentication(ctx: Context) {
  ctx.body = {
    message: 'Authenticated',
  };
}

export default {
  register,
  login,
  logout,
  checkAuthentication,
  updatePassword,
  forgetPassword,
  resetPassword,
};
