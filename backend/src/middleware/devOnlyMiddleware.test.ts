import {Context} from 'koa';

import CustomError from '../errors/customError';
import devCheck from './devOnlyMiddleware';
import {errorCode} from '../errors/errorCode';

describe('devCheck middleware', () => {
  let previousEnv: string | undefined = undefined;

  beforeAll(() => {
    previousEnv = process.env.ENVIRONMENT;
  });

  afterAll(() => {
    process.env.ENVIRONMENT = previousEnv;
  });

  it('valid, dev environment', async () => {
    process.env.ENVIRONMENT = 'dev';

    const mockNext = jest.fn();

    await devCheck({} as Context, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('invalid, undefined environment', async () => {
    process.env.ENVIRONMENT = undefined;

    const mockNext = jest.fn();

    await expect(() => devCheck({} as Context, mockNext)).rejects.toThrow(
      new CustomError(
        errorCode.API_ONLY_AVAILABLE_ON_DEV,
        'API only available on dev'
      )
    );

    expect(mockNext).not.toHaveBeenCalled();
  });

  it('invalid, other environment', async () => {
    process.env.ENVIRONMENT = 'others';

    const mockNext = jest.fn();

    await expect(() => devCheck({} as Context, mockNext)).rejects.toThrow(
      new CustomError(
        errorCode.API_ONLY_AVAILABLE_ON_DEV,
        'API only available on dev'
      )
    );

    expect(mockNext).not.toHaveBeenCalled();
  });
});
