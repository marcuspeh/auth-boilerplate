import NodeRSA from 'node-rsa';

import constant from '../../constant';
import CustomError from '../../errors/customError';
import {errorCode} from '../../errors/errorCode';

const privateKey = new NodeRSA(
  process.env.PRIVATE_KEY || constant.EMPTY_STRING
);
const publicKey = new NodeRSA(process.env.PUBLIC_KEY || constant.EMPTY_STRING);

async function decrypt(ciphertext: string): Promise<string> {
  try {
    return privateKey.decrypt(ciphertext, 'utf8');
  } catch (err: any) {
    throw new CustomError(errorCode.UNHANDLED_ERROR, err.message);
  }
}

async function encrypt(plaintext: string): Promise<string> {
  try {
    return publicKey.encrypt(plaintext, 'base64');
  } catch (err: any) {
    throw new CustomError(errorCode.UNHANDLED_ERROR, err.message);
  }
}

export default {
  decrypt,
  encrypt,
};
