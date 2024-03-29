import {Context} from 'koa';
import jwt from 'jsonwebtoken';

import constant from '../constant';
import CustomError from '../errors/customError';
import {errorCode} from '../errors/errorCode';
import JwtPayloadModel from '../models/jwtPayloadModel';
import Token from '../entity/token';
import {TOKEN_TYPE} from '../enum/tokenType';
import tokenService from '../services/tokenService';

const validateToken = async (
  ctx: Context,
  token: any,
  tokenType: TOKEN_TYPE
) => {
  if (!token) {
    throw new CustomError(errorCode.TOKEN_DOES_NOT_EXISTS);
  }

  let payload;
  try {
    payload = await jwt.verify(
      token,
      process.env.JWT_SECRET || constant.EMPTY_STRING
    );
  } catch (e) {
    throw new CustomError(errorCode.TOKEN_INVALID);
  }

  const jwtPayloadModel: JwtPayloadModel = JwtPayloadModel.from(payload);
  const tokenObject: Token = await tokenService.verifyToken(
    jwtPayloadModel.tokenId,
    jwtPayloadModel.userId,
    tokenType
  );

  if (tokenType === TOKEN_TYPE.USER_TOKEN) {
    ctx.request.header.userId = tokenObject.user.id;
    ctx.request.header.tokenId = tokenObject.id;
    ctx.request.header.expiryDate = tokenObject.expiryDate.toString();
  }
};

const validateCsrf = (tokenCsrf: any, token: any) => {
  if (!tokenCsrf && token) {
    throw new CustomError(errorCode.CSRF_DOES_NOT_EXISTS);
  }

  if (tokenCsrf !== token) {
    throw new CustomError(errorCode.CSRF_MISMATCH);
  }
};

const auth = async (ctx: Context, next: any) => {
  const token = ctx.cookies.get(constant.JWT_TOKEN_LABEL);
  const tokenCsrf = ctx.request.header.tonic;

  await validateToken(ctx, token, TOKEN_TYPE.USER_TOKEN);
  validateCsrf(tokenCsrf, token);

  await next();
};

export default auth;
