import NodeRSA from 'node-rsa';
import CustomError from '../../errors/customError';
import {errorCode} from '../../errors/errorCode';

class RsaServiceHelper {
  private key = process.env.PRIVATE_KEY;
  private privateKey = new NodeRSA(process.env.PRIVATE_KEY || '');
  private publicKey = new NodeRSA(process.env.PUBLIC_KEY || '');

  public async decrypt(ciphertext: string): Promise<string> {
    try {
      return this.privateKey.decrypt(ciphertext, 'utf8');
    } catch (err: any) {
      throw new CustomError(errorCode.UNHANDLED_ERROR, err.message);
    }
  }

  public async encrypt(plaintext: string): Promise<string> {
    try {
      return this.publicKey.encrypt(plaintext, 'base64');
    } catch (err: any) {
      throw new CustomError(errorCode.UNHANDLED_ERROR, err.message);
    }
  }
}

export default new RsaServiceHelper();
