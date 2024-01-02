import bcrypt from 'bcryptjs';

import CustomError from '../../errors/customError';
import {errorCode} from '../../errors/errorCode';

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  return passwordHash;
}

async function checkPassword(
  password: string,
  passwordHash: string
): Promise<void> {
  const isAuthenticated = await bcrypt.compare(password, passwordHash);

  if (!isAuthenticated) {
    throw new CustomError(errorCode.CREDENTIALS_INVALID);
  }
}

export default {
  hashPassword,
  checkPassword,
};
