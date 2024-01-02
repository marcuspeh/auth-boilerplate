import moment from 'moment';

import CustomError from '../../errors/customError';
import {errorCode} from '../../errors/errorCode';
import Token from '../../entity/token';
import {TOKEN_TYPE} from '../../enum/tokenType';

async function isExpired(token: Token, throwErr = false): Promise<boolean> {
  const isExpired: boolean = moment().isAfter(token.expiryDate);
  if (throwErr && isExpired) {
    throw new CustomError(errorCode.TOKEN_EXPIRED);
  }

  return isExpired;
}

async function isValid(
  token: Token,
  tokenType: TOKEN_TYPE,
  throwErr = false
): Promise<boolean> {
  if (token.type !== tokenType || !token.isValid) {
    if (throwErr) {
      throw new CustomError(errorCode.TOKEN_INVALID);
    }
    return false;
  }

  const isTokenExpired = await isExpired(token, throwErr);
  return !isTokenExpired;
}

export default {
  isValid,
};
