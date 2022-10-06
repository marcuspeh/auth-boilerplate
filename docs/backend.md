# Backend

For all request, the following is required in the header: 
```
APITOKEN: "VERY SECRET KEY"
```

## Endpoints

| Endpoints | Method | Access | Description|
| --- | --- | --- | --- |
| /api/crypto/getPublicKey | GET | ALL | Gets public key to encrypt password |
| /api/crypto/encrypt | POST | DEV | RSA encrypts a plaintext using public key |
| /api/crypto/decrypt | POST | DEV | RSA decrypts a ciphertext using private key |
| /api/crypto/hashPassword | POST | DEV | Hashes a password with salt |
| /api/crypto/checkPassword | POST | DEV | Checks if a hashed password matches the hash |
| |
| /api/user/register | POST | ALL | Registers a new user |
| /api/user/login | POST | ALL | Logs in a user |
| /api/user/logout | POST | ALL | Logout a user |

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

## API: /api/user/register

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

## API: /api/user/login

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

## API: /api/user/logout

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
None
---
