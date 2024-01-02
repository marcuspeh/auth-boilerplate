import constant from '../constant';
import CustomError from '../errors/customError';
import {errorCode} from '../errors/errorCode';
import jwtServiceHelper from './helper/jwtServiceHelper';
import Token from '../entity/token';
import {TOKEN_TYPE} from '../enum/tokenType';
import TokenDb from '../db/tokenDb';
import tokenServiceHelper from './helper/tokenServiceHelper';
import User from '../entity/user';

async function generateUserToken(user: User): Promise<string> {
  await TokenDb.invalidateToken(user.id, TOKEN_TYPE.USER_TOKEN);

  const expiryTimeFromNow: number =
    Number(process.env.MAX_USER_TOKEN_VALIDITY_SECONDS) ||
    constant.DEFAULT_TOKEN_EXPIRY_SECONDS;
  const userToken: Token = await TokenDb.createToken(
    user,
    TOKEN_TYPE.USER_TOKEN,
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
  verifyToken,
  invalidateToken,
  invalidateExpiredToken,
};
