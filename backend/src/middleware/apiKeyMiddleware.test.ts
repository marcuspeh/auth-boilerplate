import {Context} from 'koa';

import apiKeyCheck from './apiKeyMiddleware';
import CustomError from '../errors/customError';
import {errorCode} from '../errors/errorCode';

describe('apiKeyCheck middleware', () => {
  let previousApiKey: string | undefined = undefined;
  let mockContext = {
    request: {
      header: {
        apitoken: '',
      },
    },
  };

  beforeAll(() => {
    previousApiKey = process.env.API_KEY;
  });

  afterAll(() => {
    process.env.API_KEY = previousApiKey;
  });

  beforeEach(() => {
    mockContext = {
      request: {
        header: {
          apitoken: '',
        },
      },
    };
  });

  it('valid, API key is valid', async () => {
    process.env.API_KEY = 'api_key';
    mockContext.request.header.apitoken = process.env.API_KEY;

    const mockNext = jest.fn();

    await apiKeyCheck(mockContext as unknown as Context, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('invalid, API key is invalid', async () => {
    process.env.API_KEY = 'api_key';
    mockContext.request.header.apitoken = 'invalid-key';

    const mockNext = jest.fn();

    await expect(() =>
      apiKeyCheck(mockContext as unknown as Context, mockNext)
    ).rejects.toThrow(
      new CustomError(errorCode.API_KEY_INVALID, 'Invalid API key')
    );

    expect(mockNext).not.toHaveBeenCalled();
  });
});
