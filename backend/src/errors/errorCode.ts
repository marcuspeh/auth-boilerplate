/*
4 digit Error code format
- First 2 digits:
    - 00: Generic
    - 01: Crypto
    - 02: User
    - 03. Token
- Next 2 digits: Start with 00 and just count up
*/

export const errorCode = {
  /* Generic error code */
  UNHANDLED_ERROR: 'E0000',
  API_ONLY_AVAILABLE_ON_DEV: 'E0001',
  API_KEY_INVALID: 'E0002',

  INVALID_REQUEST_BODY: 'E0010',
  ENTITY_VALIDATION_ERROR: 'E0011',

  /* Crypto error code */
  PASSWORD_HASHING_ERROR: 'E0100',

  /* User error code */
  CREDENTIALS_INVALID: 'E0200',
  EMAIL_INVALID: 'E0201',
  EMAIL_EXISTS: 'E0202',
  PASSWORD_REQUIREMENT_NOT_MET: 'E0203',
  USER_NOT_FOUND: 'E0204',

  /* Token error code */
  TOKEN_EXPIRED: 'E0300',
  TOKEN_INVALID: 'E0301',
  TOKEN_DOES_NOT_EXISTS: 'E0302',
  CSRF_DOES_NOT_EXISTS: 'E0303',
  CSRF_MISMATCH: 'E0304',
};
