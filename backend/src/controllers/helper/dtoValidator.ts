import {plainToInstance} from 'class-transformer';
import {validate} from 'class-validator';

import constant from '../../constant';
import CustomError from '../../errors/customError';
import {errorCode} from '../../errors/errorCode';

// Referenced https://medium.com/@saman.ghm/validation-and-conversion-request-body-in-one-line-for-node-js-with-typescript-6adfac0ccd0a
async function inputValidate(dto: any, input: any): Promise<any> {
  const apiDto = plainToInstance(dto || constant.EMPTY_JSON, input);

  try {
    await validate(apiDto, {forbidUnknownValues: true}).then(err => {
      if (err.length > 0) {
        throw new CustomError(errorCode.INVALID_REQUEST_BODY);
      }
    });
  } catch {
    throw new CustomError(errorCode.INVALID_REQUEST_BODY);
  }

  return apiDto;
}

export default {
  inputValidate,
};
