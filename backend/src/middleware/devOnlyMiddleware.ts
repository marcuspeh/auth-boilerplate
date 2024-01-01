import {Context} from 'koa';

import CustomError from '../errors/customError';
import {errorCode} from '../errors/errorCode';

const devCheck = async (ctx: Context, next: any) => {
  if (process.env.ENVIRONMENT !== 'dev') {
    throw new CustomError(
      errorCode.API_ONLY_AVAILABLE_ON_DEV,
      'API only available on dev'
    );
  }

  await next();
};

export default devCheck;
