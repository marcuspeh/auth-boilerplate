import {IsDefined, IsString} from 'class-validator';

import CustomError from '../../errors/customError';
import dtoValidator from './dtoValidator';
import {errorCode} from '../../errors/errorCode';

class TestDTO {
  @IsDefined()
  @IsString()
  text: string;
}

describe('DtoValidator', () => {
  describe('inputValidate', () => {
    it('valid', async () => {
      const input = {
        text: 'hello world',
      };

      const transformedDto: TestDTO = {
        text: 'hello world',
      };

      const result = await dtoValidator.inputValidate(TestDTO, input);

      expect(result).toEqual(transformedDto);
    });

    it('valid, with extra input parameters', async () => {
      const input = {
        text: 'hello world',
        extra: 'goodbye world',
      };

      const transformedDto = {
        text: 'hello world',
        extra: 'goodbye world',
      };

      const result = await dtoValidator.inputValidate(TestDTO, input);

      expect(result).toEqual(transformedDto);
    });

    it('invalid, with wrong type', async () => {
      const input = {
        text: 123,
      };

      await expect(() =>
        dtoValidator.inputValidate(TestDTO, input)
      ).rejects.toThrow(new CustomError(errorCode.INVALID_REQUEST_BODY));
    });

    it('invalid, with empty json', async () => {
      const input = {};

      await expect(() =>
        dtoValidator.inputValidate(TestDTO, input)
      ).rejects.toThrow(new CustomError(errorCode.INVALID_REQUEST_BODY));
    });

    it('invalid, undefined input', async () => {
      const input = null;

      await expect(() =>
        dtoValidator.inputValidate(TestDTO, input)
      ).rejects.toThrow(new CustomError(errorCode.INVALID_REQUEST_BODY));
    });
  });
});
