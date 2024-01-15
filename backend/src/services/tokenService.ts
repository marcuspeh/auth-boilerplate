import jwt from 'jsonwebtoken';

import constant from '../constant';
import CustomError from '../errors/customError';
import {errorCode} from '../errors/errorCode';
import JwtPayloadModel from '../models/jwtPayloadModel';
import jwtServiceHelper from './helper/jwtServiceHelper';
import Token from '../entity/token';
import {TOKEN_TYPE} from '../enum/tokenType';
import TokenDb from '../db/tokenDb';
import tokenServiceHelper from './helper/tokenServiceHelper';
import User from '../entity/user';

async function generateUserToken(user: User): Promise<string> {
  const expiryTimeFromNow: number =
    Number(process.env.MAX_USER_TOKEN_VALIDITY_SECONDS) ||
    constant.DEFAULT_TOKEN_EXPIRY_SECONDS;

  return generateToken(user, TOKEN_TYPE.USER_TOKEN, expiryTimeFromNow, true);
}

async function generateForgetPasswordToken(user: User): Promise<string> {
  const expiryTimeFromNow: number =
    Number(process.env.MAX_FORGET_PASSWORD_TOKEN_VALIDITY_SECONDS) ||
    constant.DEFAULT_TOKEN_EXPIRY_SECONDS;

  return generateToken(
    user,
    TOKEN_TYPE.FORGET_PASSWORD,
    expiryTimeFromNow,
    true
  );
}

async function generateToken(
  user: User,
  tokenType: TOKEN_TYPE,
  expiryTimeFromNow: number,
  shouldInvalidatePrevious: boolean
) {
  if (shouldInvalidatePrevious) {
    await TokenDb.invalidateToken(user.id, tokenType);
  }

  const userToken: Token = await TokenDb.createToken(
    user,
    tokenType,
    expiryTimeFromNow
  );

  const userTokenJwt: string = await jwtServiceHelper.signJwtToken(userToken);
  return userTokenJwt;
}

async function verifyToken(
  tokenId: string,
  userId: string,
  tokenType: TOKEN_TYPE
): Promise<Token> {
  const token: Token | null = await TokenDb.getToken(tokenId);

  if (token === null) {
    throw new CustomError(errorCode.TOKEN_DOES_NOT_EXISTS);
  }

  if (token.user.id !== userId) {
    throw new CustomError(errorCode.TOKEN_INVALID);
  }

  await tokenServiceHelper.isValid(token, tokenType, true);

  return token;
}

async function verifyResetPasswordToken(token: string): Promise<User> {
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
  const tokenObject: Token = await verifyToken(
    jwtPayloadModel.tokenId,
    jwtPayloadModel.userId,
    TOKEN_TYPE.FORGET_PASSWORD
  );

  return tokenObject.user;
}

async function invalidateToken(
  userId: string,
  tokenType: TOKEN_TYPE
): Promise<void> {
  await TokenDb.invalidateToken(userId, tokenType);
}

async function invalidateExpiredToken(): Promise<void> {
  await TokenDb.invalidateExpiredToken();
}

export default {
  generateUserToken,
  generateForgetPasswordToken,
  verifyToken,
  verifyResetPasswordToken,
  invalidateToken,
  invalidateExpiredToken,
};
