import moment from 'moment';

import tokenServiceHelper from './tokenServiceHelper';
import CustomError from '../../errors/customError';
import {errorCode} from '../../errors/errorCode';
import Token from '../../entity/token';
import {TOKEN_TYPE} from '../../enum/tokenType';

describe('TokenServiceHelper', () => {
  describe('isExpired', () => {
    test('valid, expired token', async () => {
      const expiredToken: Token = new Token();
      expiredToken.expiryDate = moment().subtract(1, 'day').toDate();

      const result = await tokenServiceHelper.isExpired(expiredToken);

      expect(result).toBe(true);
    });

    test('valid, token not expired', async () => {
      const validToken: Token = new Token();
      validToken.expiryDate = moment().add(1, 'day').toDate();

      const result = await tokenServiceHelper.isExpired(validToken);

      expect(result).toBe(false);
    });

    test('invalid, token is expired and error is thrown', async () => {
      const expiredToken: Token = new Token();
      expiredToken.expiryDate = moment().subtract(1, 'day').toDate();

      await expect(() =>
        tokenServiceHelper.isExpired(expiredToken, true)
      ).rejects.toThrow(new CustomError(errorCode.TOKEN_EXPIRED));
    });
  });

  describe('isValid', () => {
    test('valid, token is valid', async () => {
      const validToken: Token = new Token();
      validToken.expiryDate = moment().add(1, 'day').toDate();
      validToken.type = TOKEN_TYPE.USER_TOKEN;
      validToken.isValid = true;

      const result = await tokenServiceHelper.isValid(
        validToken,
        TOKEN_TYPE.USER_TOKEN
      );

      expect(result).toBe(true);
    });

    test('valid, invalid token without error', async () => {
      const invalidToken: Token = new Token();
      invalidToken.type = TOKEN_TYPE.USER_TOKEN;
      invalidToken.isValid = false;

      const result = await tokenServiceHelper.isValid(
        invalidToken,
        TOKEN_TYPE.USER_TOKEN
      );

      expect(result).toBe(false);
    });

    test('invalid, invalid token with error', async () => {
      const invalidToken: Token = new Token();
      invalidToken.type = TOKEN_TYPE.USER_TOKEN;
      invalidToken.isValid = false;

      await expect(() =>
        tokenServiceHelper.isValid(invalidToken, TOKEN_TYPE.USER_TOKEN, true)
      ).rejects.toThrow(new CustomError(errorCode.TOKEN_INVALID));
    });

    test('valid, return false for expired token', async () => {
      const validToken: Token = new Token();
      validToken.expiryDate = moment().subtract(1, 'day').toDate();
      validToken.type = TOKEN_TYPE.USER_TOKEN;
      validToken.isValid = true;

      const result = await tokenServiceHelper.isValid(
        validToken,
        TOKEN_TYPE.USER_TOKEN
      );

      expect(result).toBe(false);
    });

    test('invalid, expired token with error', async () => {
      const validToken: Token = new Token();
      validToken.expiryDate = moment().subtract(1, 'day').toDate();
      validToken.type = TOKEN_TYPE.USER_TOKEN;
      validToken.isValid = true;

      await expect(() =>
        tokenServiceHelper.isValid(validToken, TOKEN_TYPE.USER_TOKEN, true)
      ).rejects.toThrow(new CustomError(errorCode.TOKEN_EXPIRED));
    });
  });
});
