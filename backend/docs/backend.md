# Backend

For all request, the following is required in the header: 
```
APITOKEN: "VERY SECRET KEY"
```

**Postman collection are available at ```./Boilerplate.postman_collection```**

## Endpoints

| Endpoints | Method | Access | Description|
| --- | --- | --- | --- |
| /api/serverStatus | GET | ALL | Pings and check if server is up |
| |
| /api/crypto/getPublicKey | GET | ALL | Gets public key to encrypt password |
| /api/crypto/encrypt | POST | DEV | RSA encrypts a plaintext using public key |
| /api/crypto/decrypt | POST | DEV | RSA decrypts a ciphertext using private key |
| /api/crypto/hashPassword | POST | DEV | Hashes a password with salt |
| /api/crypto/checkPassword | POST | DEV | Checks if a hashed password matches the hash |
| |
| /api/auth/register | POST | ALL | Registers a new user |
| /api/auth/login | POST | ALL | Logs in a user |
| /api/auth/logout | POST | ALL | Logout a user |
| /api/auth/updatePassword | POST | ALL | Update user's password |
| /api/auth/checkAuth | GET | ALL | Check if user is authenticated |

---

## API: /api/serverStatus

### Description: 
Pings and check if server is up

### Request body:
None

### Reponse:
```json
{
    "status": "OK"
}
```

### Errors: 
None

---

## API: /api/crypto/getPublicKey

### Description: 
Gets public key to encrypt password

### Request body:
None

### Reponse:
```json
{
    "publicKey": "Key is here"
}
```

### Errors: 
None

---

## API: /api/crypto/encrypt

### Description: 
RSA encrypts a plaintext using public key

### Request body:
```json
{
    "text": "Plaintext"
}
```

### Reponse:
```json
{
    "ciphertext": "Ciphertext"
}
```

### Errors: 
E0010: Request body format is wrong

---

## API: /api/crypto/decrypt

### Description: 
RSA decrypts a ciphertext using private key

### Request body:
```json
{
    "text": "Ciphertext"
}
```

### Reponse:
```json
{
    "plainText": "Plaintext"
}
```

### Errors: 
E0010: Request body format is wrong

---

## API: /api/crypto/hashPassword

### Description: 
Hashes a password with salt

### Request body:
```json
{
    "password": "password"
}
```

### Reponse:
```json
{
    "passwordHash": "passwordHash"
}
```

### Errors: 
E0010: Request body format is wrong

---

## API: /api/crypto/checkPassword

### Description: 
Checks if a hashed password matches the hash

### Request body:
{
    "password": "password",
    "passwordHash": "passwordHash"
}
```

### Reponse:
```json
{
    message: "Success"
}
```

### Errors: 
E0010: Request body format is wrong
E0300: Invalid password

---

## API: /api/auth/register

### Description: 
Registers a new user

### Request body:
```json
{
    "name": "name",
    "email": "email",
    "password": "encrypted password"
}
```

### Reponse:
```json
{
    "user": {
        "name": "name",
        "email": "email"
    }
}
```

### Errors: 
E0010: Request body format is wrong
E0302: Email already exists

---

## API: /api/auth/login

### Description: 
Logs in a user

### Request body:
```json
{
    "email": "email",
    "password": "encrypted password"
}
```

### Reponse:
```json
{
    "user": {
        "name": "name",
        "email": "email"
    }
}
```

### Errors: 
E0010: Request body format is wrong
E0300: Invalid credentials

---

## API: /api/auth/logout

### Description: 
Logout a user

### Request body:
None

### Reponse:
```json
{
    "message": "Goodbye"
}
```

### Errors: 
E0300: TOKEN_EXPIRED
E0301: TOKEN_INVALID
E0302: TOKEN_DOES_NOT_EXISTS
E0303: CSRF_DOES_NOT_EXISTS
E0304: CSRF_MISMATCH
---

## API: /api/auth/updatePassword

### Description: 
Update password of user

### Request body:
```json
{
    "originalPassword": "original password",
    "newPassword": "new password"
}
```

### Reponse:
```json
{
    "message": "Updated",
}
```

### Errors: 
E0010: Request body format is wrong
E0200: Credentials invalid
E0300: TOKEN_EXPIRED
E0301: TOKEN_INVALID
E0302: TOKEN_DOES_NOT_EXISTS
E0303: CSRF_DOES_NOT_EXISTS
E0304: CSRF_MISMATCH
---

## API: /api/auth/checkAuth

### Description: 
Check if user is logged in

### Request body:
None

### Reponse:
```json
{
    "message": "Authenticated"
}
```

### Errors: 
E0300: TOKEN_EXPIRED
E0301: TOKEN_INVALID
E0302: TOKEN_DOES_NOT_EXISTS
E0303: CSRF_DOES_NOT_EXISTS
E0304: CSRF_MISMATCH
---
