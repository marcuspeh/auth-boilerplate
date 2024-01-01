import CryptoService from './cryptoService';
import passwordServiceHelper from './helper/passwordServiceHelper';
import rsaServiceHelper from './helper/rsaServiceHelper';

jest.mock('./helper/passwordServiceHelper', () => ({}));
jest.mock('./helper/rsaServiceHelper', () => ({}));

describe('CryptoService', () => {
  let cryptoService: CryptoService;

  beforeEach(() => {
    cryptoService = new CryptoService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('decrypt', () => {
    it('valid, should decrypt ciphertext', async () => {
      const mockCiphertext = 'mocked-ciphertext';
      rsaServiceHelper.decrypt = jest
        .fn()
        .mockResolvedValue('mocked-plaintext');

      const result = await cryptoService.decrypt(mockCiphertext);

      expect(rsaServiceHelper.decrypt).toHaveBeenCalledWith(mockCiphertext);
      expect(result).toEqual('mocked-plaintext');
    });
  });

  describe('encrypt', () => {
    it('valid, should encrypt plaintext', async () => {
      const mockPlaintext = 'mocked-plaintext';
      rsaServiceHelper.encrypt = jest
        .fn()
        .mockResolvedValue('mocked-ciphertext');

      const result = await cryptoService.encrypt(mockPlaintext);

      expect(rsaServiceHelper.encrypt).toHaveBeenCalledWith(mockPlaintext);
      expect(result).toEqual('mocked-ciphertext');
    });
  });

  describe('hashPassword', () => {
    it('valid, should hash password', async () => {
      const mockPassword = 'mocked-password';
      passwordServiceHelper.hashPassword = jest
        .fn()
        .mockResolvedValue('mocked-password-hash');

      const result = await cryptoService.hashPassword(mockPassword);

      expect(passwordServiceHelper.hashPassword).toHaveBeenCalledWith(
        mockPassword
      );
      expect(result).toEqual('mocked-password-hash');
    });
  });

  describe('checkPassword', () => {
    it('valid, should check password', async () => {
      const mockPassword = 'mocked-password';
      const mockPasswordHash = 'mocked-password-hash';
      passwordServiceHelper.checkPassword = jest
        .fn()
        .mockResolvedValue(undefined);

      await cryptoService.checkPassword(mockPassword, mockPasswordHash);

      expect(passwordServiceHelper.checkPassword).toHaveBeenCalledWith(
        mockPassword,
        mockPasswordHash
      );
    });
  });
});
