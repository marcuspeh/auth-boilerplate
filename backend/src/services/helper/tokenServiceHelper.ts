import {TOKEN_TYPE} from '../../entity/enum/tokenType';
import moment from 'moment';
import Token from '../../entity/token';
import CustomError from '../../errors/customError';
import {errorCode} from '../../errors/errorCode';

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
    }

    return !this.isExpired(token);
  }
}

export default new TokenServiceHelper();
