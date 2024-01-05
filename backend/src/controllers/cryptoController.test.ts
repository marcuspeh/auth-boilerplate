import {Context} from 'koa';

import {encryptionDTO, hashingDTO} from './apiSchemas/cryptoDTO';
import cryptoController from './cryptoController';
import cryptoService from '../services/cryptoService';
import dtoValidator from './helper/dtoValidator';

jest.mock('../services/cryptoService', () => ({}));
jest.mock('./helper/dtoValidator', () => ({}));

describe('getPublicKey', () => {
  let previousPublicKey: string | undefined = undefined;

  beforeAll(() => {
    previousPublicKey = process.env.PUBLIC_KEY;
  });

  afterAll(() => {
    process.env.PUBLIC_KEY = previousPublicKey;
  });

  it('valid, env public key', async () => {
    process.env.PUBLIC_KEY = 'publicKey';

    const expectedBody = {
      publicKey: process.env.PUBLIC_KEY,
    };

    const context: unknown = {};
    await cryptoController.getPublicKey(context as Context);

    expect((context as Context).body).toStrictEqual(expectedBody);
  });
});

describe('encrypt', () => {
  it('valid, can encrypt', async () => {
    const ciphertext = 'ciphertext';
    const request = {text: 'plaintext'};
    const expectedBody = {ciphertext: ciphertext};

    dtoValidator.inputValidate = jest.fn().mockResolvedValue(request);
    cryptoService.encrypt = jest.fn().mockResolvedValue(ciphertext);

    const context: unknown = {
      request: {
        body: request,
      },
    };
    await cryptoController.encrypt(context as Context);

    expect((context as Context).body).toStrictEqual(expectedBody);

    expect(dtoValidator.inputValidate).toHaveBeenCalledWith(
      encryptionDTO,
      request
    );
    expect(cryptoService.encrypt).toHaveBeenCalledWith(request.text);
  });
});

describe('decrypt', () => {
  it('valid, can decrypt', async () => {
    const plaintext = 'plaintext';
    const request = {text: 'ciphertext'};
    const expectedBody = {plaintext: plaintext};

    dtoValidator.inputValidate = jest.fn().mockResolvedValue(request);
    cryptoService.decrypt = jest.fn().mockResolvedValue(plaintext);

    const context: unknown = {
      request: {
        body: request,
      },
    };
    await cryptoController.decrypt(context as Context);

    expect((context as Context).body).toStrictEqual(expectedBody);

    expect(dtoValidator.inputValidate).toHaveBeenCalledWith(
      encryptionDTO,
      request
    );
    expect(cryptoService.decrypt).toHaveBeenCalledWith(request.text);
  });
});

describe('hashPasword', () => {
  it('valid, hashed', async () => {
    const passwordHash = 'hashedPassword';
    const request = {password: 'password'};
    const expectedBody = {passwordHash: passwordHash};

    dtoValidator.inputValidate = jest.fn().mockResolvedValue(request);
    cryptoService.hashPassword = jest.fn().mockResolvedValue(passwordHash);

    const context: unknown = {
      request: {
        body: request,
      },
    };
    await cryptoController.hashPasword(context as Context);

    expect((context as Context).body).toStrictEqual(expectedBody);

    expect(dtoValidator.inputValidate).toHaveBeenCalledWith(
      hashingDTO,
      request
    );
    expect(cryptoService.hashPassword).toHaveBeenCalledWith(request.password);
  });
});

describe('checkPassword', () => {
  it('valid, password match', async () => {
    const passwordHash = 'hashedPassword';
    const request = {password: 'password'};
    const expectedBody = {passwordHash: passwordHash};

    dtoValidator.inputValidate = jest.fn().mockResolvedValue(request);
    cryptoService.hashPassword = jest.fn().mockResolvedValue(passwordHash);

    const context: unknown = {
      request: {
        body: request,
      },
    };
    await cryptoController.hashPasword(context as Context);

    expect((context as Context).body).toStrictEqual(expectedBody);

    expect(dtoValidator.inputValidate).toHaveBeenCalledWith(
      hashingDTO,
      request
    );
    expect(cryptoService.hashPassword).toHaveBeenCalledWith(request.password);
  });
});
