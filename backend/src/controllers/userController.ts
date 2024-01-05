import {Context} from 'koa';

import {loginUserDTO, registerUserDTO} from './apiSchemas/userDTO';
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
};
