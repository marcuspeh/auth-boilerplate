import passwordServiceHelper from './helper/passwordServiceHelper';
import rsaServiceHelper from './helper/rsaServiceHelper';

async function decrypt(ciphertext: string): Promise<string> {
  return rsaServiceHelper.decrypt(ciphertext);
}

async function encrypt(plaintext: string): Promise<string> {
  return rsaServiceHelper.encrypt(plaintext);
}

async function hashPassword(password: string): Promise<string> {
  return passwordServiceHelper.hashPassword(password);
}

async function checkPassword(
  password: string,
  passwordHash: string
): Promise<void> {
  return passwordServiceHelper.checkPassword(password, passwordHash);
}

export default {
  decrypt,
  encrypt,
  hashPassword,
  checkPassword,
};
