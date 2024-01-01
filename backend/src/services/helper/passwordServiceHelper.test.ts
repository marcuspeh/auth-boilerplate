import bcrypt from 'bcryptjs';

import CustomError from '../../errors/customError';
import {errorCode} from '../../errors/errorCode';
import passwordServiceHelper from './passwordServiceHelper';

const mockSalt = '$2a$10$fHA6/UVmzntiaLlJDo49PO';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockImplementation(jest.requireActual('bcryptjs').hash),
  compare: jest.fn().mockImplementation(jest.requireActual('bcryptjs').compare),
}));

describe('PasswordServiceHelper', () => {
  describe('hashPassword', () => {
    afterEach(() => {
      bcrypt.genSalt = jest.fn();
    });

    test('success, number', async () => {
      const input = '35366746';
      const expectedOutput =
        '$2a$10$fHA6/UVmzntiaLlJDo49POBWprEEjz13t0cQ9IDEpt3WEkvNv6G4G';

      bcrypt.genSalt = jest
        .fn()
        .mockResolvedValue('$2a$10$fHA6/UVmzntiaLlJDo49PO');

      const output = await passwordServiceHelper.hashPassword(input);
      expect(output).toBe(expectedOutput);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(input, mockSalt);
    });

    test('success, symbols', async () => {
      const input = '!$#%$%#%#^&%&';
      const expectedOutput =
        '$2a$10$fHA6/UVmzntiaLlJDo49POtwr5qz6Jm12TEQqlPF/ob6SIWvCgid.';

      bcrypt.genSalt = jest
        .fn()
        .mockResolvedValue('$2a$10$fHA6/UVmzntiaLlJDo49PO');

      const output = await passwordServiceHelper.hashPassword(input);
      expect(output).toBe(expectedOutput);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(input, mockSalt);
    });

    test('success, mixed', async () => {
      const input = 'dvVFG#4g#BNvdv#';
      const expectedOutput =
        '$2a$10$fHA6/UVmzntiaLlJDo49POGY1Z4yDkhhRFIs41Wy1w2JHqPXI4eci';

      bcrypt.genSalt = jest
        .fn()
        .mockResolvedValue('$2a$10$fHA6/UVmzntiaLlJDo49PO');

      const output = await passwordServiceHelper.hashPassword(input);
      expect(output).toBe(expectedOutput);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(input, mockSalt);
    });

    test('success, empty string', async () => {
      const input = '';
      const expectedOutput =
        '$2a$10$fHA6/UVmzntiaLlJDo49POyhlWEbEyAf5BFW/UJ6J9CzSBltJ3aae';

      bcrypt.genSalt = jest
        .fn()
        .mockResolvedValue('$2a$10$fHA6/UVmzntiaLlJDo49PO');

      const output = await passwordServiceHelper.hashPassword(input);
      expect(output).toBe(expectedOutput);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(input, mockSalt);
    });
  });

  describe('checkPassword', () => {
    test('success', async () => {
      const password = 'dvVFG#4g#BNvdv#';
      const passwordHash =
        '$2a$10$fHA6/UVmzntiaLlJDo49POGY1Z4yDkhhRFIs41Wy1w2JHqPXI4eci';

      await passwordServiceHelper.checkPassword(password, passwordHash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, passwordHash);
    });

    test('invalid, should throw error', async () => {
      const password = 'sfbfdbfhbf';
      const passwordHash =
        '$2a$10$fHA6/UVmzntiaLlJDo49POGY1Z4yDkhhRFIs41Wy1w2JHqPXI4eci';

      await expect(() =>
        passwordServiceHelper.checkPassword(password, passwordHash)
      ).rejects.toThrow(new CustomError(errorCode.CREDENTIALS_INVALID));

      expect(bcrypt.compare).toHaveBeenCalledWith(password, passwordHash);
    });
  });
});
