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

/**
Requirements for password:
1) Length more than 8
*/
function checkPasswordRequirements(password: string): void {
  passwordLengthMoreThan8(password);
}

function passwordLengthMoreThan8(password: string): void {
  if (password.length >= 8) {
    return;
  }

  throw new CustomError(
    errorCode.PASSWORD_REQUIREMENT_NOT_MET,
    'Password length must be at least 8'
  );
}

export default {
  hashPassword,
  checkPassword,
  checkPasswordRequirements,
};
