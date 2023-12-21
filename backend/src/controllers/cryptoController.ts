import {Context} from 'koa';
import CryptoService from '../services/cryptoService';
import {encryptionDTO, hashingDTO} from './apiSchemas/cryptoDTO';
import dtoValidator from './helper/dtoValidator';

class CryptoController {
  private CryptoService: CryptoService = new CryptoService();

  public async getPublicKey(ctx: Context) {
    const publicKey: string = process.env.PUBLIC_KEY;

    ctx.body = {
      publicKey: publicKey,
    };
  }

  public async encrypt(ctx: Context) {
    const apiDto = await dtoValidator.inputValidate(
      encryptionDTO,
      ctx.request.body
    );

    const ciphertext = await this.CryptoService.encrypt(apiDto.text);

    ctx.body = {
      ciphertext: ciphertext,
    };
  }

  public async decrypt(ctx: Context) {
    const apiDto = await dtoValidator.inputValidate(
      encryptionDTO,
      ctx.request.body
    );

    const plaintext = await this.CryptoService.decrypt(apiDto.text);

    ctx.body = {
      plaintext: plaintext,
    };
  }

  public async hashPasword(ctx: Context) {
    const apiDto = await dtoValidator.inputValidate(
      hashingDTO,
      ctx.request.body
    );

    const passwordHash = await this.CryptoService.hashPassword(apiDto.password);

    ctx.body = {
      passwordHash: passwordHash,
    };
  }

  public async checkPassword(ctx: Context) {
    const apiDto = await dtoValidator.inputValidate(
      hashingDTO,
      ctx.request.body
    );

    await this.CryptoService.checkPassword(
      apiDto.password,
      apiDto.passwordHash
    );

    ctx.body = {
      message: 'Success',
    };
  }
}

export default new CryptoController();
