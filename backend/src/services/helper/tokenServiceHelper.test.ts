import moment from 'moment';

import CustomError from '../../errors/customError';
import {errorCode} from '../../errors/errorCode';
import Token from '../../entity/token';
import {TOKEN_TYPE} from '../../enum/tokenType';
import tokenServiceHelper from './tokenServiceHelper';

describe('isValid', () => {
  it('valid, token is valid and not expired', async () => {
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

  it('valid, token is valid and not expired, err thrown set to true', async () => {
    const validToken: Token = new Token();
    validToken.expiryDate = moment().add(1, 'day').toDate();
    validToken.type = TOKEN_TYPE.USER_TOKEN;
    validToken.isValid = true;

    const result = await tokenServiceHelper.isValid(
      validToken,
      TOKEN_TYPE.USER_TOKEN,
      true
    );

    expect(result).toBe(true);
  });

  it('valid, invalid token without error', async () => {
    const invalidToken: Token = new Token();
    invalidToken.type = TOKEN_TYPE.USER_TOKEN;
    invalidToken.isValid = false;

    const result = await tokenServiceHelper.isValid(
      invalidToken,
      TOKEN_TYPE.USER_TOKEN
    );

    expect(result).toBe(false);
  });

  it('invalid, invalid token with error', async () => {
    const invalidToken: Token = new Token();
    invalidToken.type = TOKEN_TYPE.USER_TOKEN;
    invalidToken.isValid = false;

    await expect(() =>
      tokenServiceHelper.isValid(invalidToken, TOKEN_TYPE.USER_TOKEN, true)
    ).rejects.toThrow(new CustomError(errorCode.TOKEN_INVALID));
  });

  it('valid, return false for expired token', async () => {
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

  it('invalid, expired token with error', async () => {
    const validToken: Token = new Token();
    validToken.expiryDate = moment().subtract(1, 'day').toDate();
    validToken.type = TOKEN_TYPE.USER_TOKEN;
    validToken.isValid = true;

    await expect(() =>
      tokenServiceHelper.isValid(validToken, TOKEN_TYPE.USER_TOKEN, true)
    ).rejects.toThrow(new CustomError(errorCode.TOKEN_EXPIRED));
  });
});
