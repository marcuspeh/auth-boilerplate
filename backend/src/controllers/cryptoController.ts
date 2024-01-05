import {Context} from 'koa';

import {encryptionDTO, hashingDTO} from './apiSchemas/cryptoDTO';
import constant from '../constant';
import cryptoService from '../services/cryptoService';
import dtoValidator from './helper/dtoValidator';

async function getPublicKey(ctx: Context) {
  const publicKey: string = process.env.PUBLIC_KEY || constant.EMPTY_STRING;

  ctx.body = {
    publicKey: publicKey,
  };
}

async function encrypt(ctx: Context) {
  const apiDto = await dtoValidator.inputValidate(
    encryptionDTO,
    ctx.request.body
  );

  const ciphertext = await cryptoService.encrypt(apiDto.text);

  ctx.body = {
    ciphertext: ciphertext,
  };
}

async function decrypt(ctx: Context) {
  const apiDto = await dtoValidator.inputValidate(
    encryptionDTO,
    ctx.request.body
  );

  const plaintext = await cryptoService.decrypt(apiDto.text);

  ctx.body = {
    plaintext: plaintext,
  };
}

async function hashPasword(ctx: Context) {
  const apiDto = await dtoValidator.inputValidate(hashingDTO, ctx.request.body);

  const passwordHash = await cryptoService.hashPassword(apiDto.password);

  ctx.body = {
    passwordHash: passwordHash,
  };
}

async function checkPassword(ctx: Context) {
  const apiDto = await dtoValidator.inputValidate(hashingDTO, ctx.request.body);

  await cryptoService.checkPassword(apiDto.password, apiDto.passwordHash);

  ctx.body = {
    message: 'Success',
  };
}

export default {
  getPublicKey,
  encrypt,
  decrypt,
  hashPasword,
  checkPassword,
};
