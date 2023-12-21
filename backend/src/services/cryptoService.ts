import passwordServiceHelper from './helper/passwordServiceHelper';
import rsaServiceHelper from './helper/rsaServiceHelper';

export default class CryptoService {
  public async decrypt(ciphertext: string): Promise<string> {
    return rsaServiceHelper.decrypt(ciphertext);
  }

  public async encrypt(plaintext: string): Promise<string> {
    return rsaServiceHelper.encrypt(plaintext);
  }

  public async hashPassword(password: string): Promise<string> {
    return passwordServiceHelper.hashPassword(password);
  }

  public async checkPassword(
    password: string,
    passwordHash: string
  ): Promise<void> {
    return passwordServiceHelper.checkPassword(password, passwordHash);
  }
}
