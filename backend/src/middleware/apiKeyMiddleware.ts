import CustomError from '../errors/customError';
import {errorCode} from '../errors/errorCode';
import {Context} from 'koa';

const apiKeyCheck = async (ctx: Context, next: () => Promise<any>) => {
  const apiToken = ctx.request.header.apitoken;
  if (apiToken !== process.env.API_KEY) {
    throw new CustomError(errorCode.API_KEY_INVALID, 'Invalid API key');
  }
  await next();
};

export default apiKeyCheck;
