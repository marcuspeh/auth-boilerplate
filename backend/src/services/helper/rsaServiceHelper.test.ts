import NodeRSA from 'node-rsa';

import CustomError from '../../errors/customError';
import {errorCode} from '../../errors/errorCode';
import rsaServiceHelper from './rsaServiceHelper';

jest.mock('node-rsa', () => jest.fn());

describe('decrypt', () => {
  afterEach(() => {
    NodeRSA.prototype.decrypt = jest.fn();
  });

  it('should decrypt the ciphertext', async () => {
    const ciphertext = 'encrypted-text';
    const decryptedText = 'decrypted-text';

    NodeRSA.prototype.decrypt = jest.fn().mockReturnValue(decryptedText);

    const result = await rsaServiceHelper.decrypt(ciphertext);
    expect(result).toEqual(decryptedText);
    expect(NodeRSA.prototype.decrypt).toHaveBeenCalledWith(ciphertext, 'utf8');
  });

  it('should throw an error for decryption failure', async () => {
    const ciphertext = 'invalid-ciphertext';
    const errorMessage = 'Decryption failed';

    NodeRSA.prototype.decrypt = jest.fn().mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await expect(() => rsaServiceHelper.decrypt(ciphertext)).rejects.toThrow(
      new CustomError(errorCode.UNHANDLED_ERROR, errorMessage)
    );
    expect(NodeRSA.prototype.decrypt).toHaveBeenCalledWith(ciphertext, 'utf8');
  });
});

describe('encrypt', () => {
  afterEach(() => {
    NodeRSA.prototype.encrypt = jest.fn();
  });

  it('should encrypt the plaintext', async () => {
    const plaintext = 'plain-text';
    const encryptedText = 'encrypted-text';

    NodeRSA.prototype.encrypt = jest.fn().mockReturnValue(encryptedText);

    const result = await rsaServiceHelper.encrypt(plaintext);
    expect(result).toEqual(encryptedText);
    expect(NodeRSA.prototype.encrypt).toHaveBeenCalledWith(plaintext, 'base64');
  });

  it('should throw an error for encryption failure', async () => {
    const plaintext = 'invalid-plaintext';
    const errorMessage = 'Encryption failed';

    NodeRSA.prototype.encrypt = jest.fn().mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await expect(() => rsaServiceHelper.encrypt(plaintext)).rejects.toThrow(
      new CustomError(errorCode.UNHANDLED_ERROR, errorMessage)
    );
    expect(NodeRSA.prototype.encrypt).toHaveBeenCalledWith(plaintext, 'base64');
  });
});
