import moment from 'moment';

import CustomError from '../../errors/customError';
import {errorCode} from '../../errors/errorCode';
import Token from '../../entity/token';
import {TOKEN_TYPE} from '../../enum/tokenType';

class TokenServiceHelper {
  public async isExpired(token: Token, throwErr = false): Promise<boolean> {
    const isExpired: boolean = moment().isAfter(token.expiryDate);
    if (throwErr && isExpired) {
      throw new CustomError(errorCode.TOKEN_EXPIRED);
    }

    return isExpired;
  }

  public async isValid(
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

    const isExpired = await this.isExpired(token, throwErr);
    return !isExpired;
  }
}

export default new TokenServiceHelper();
