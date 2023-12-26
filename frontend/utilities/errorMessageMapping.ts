interface jsonObect {
    [x: string]: string
}

export const ErrorMapping: jsonObect = {
    /* Generic error code */
    "E0000": "E0000. Please contact administrator.",
    "E0001": "E0001. Please contact administrator.",
    "E0002": "E0002. Please contact administrator.",

    "E0010": "E0010. Please contact administrator",
    "E0011": "E0011. Please conact administrator",

    /* Cypto error code */
    "E0100": "E0100. Please conact administrator",

    /* User error code */
    "E0200": "Credentials does not match.",
    "E0201": "Email is invalid.",
    "E0202": "Email is already registered. Please sign in.",
    "E0203": "Please use a stronger password.",
    "E0204": "User not found",

    /* Token error code */
    'E0300': "Authentication token expired. Please sign in again.",
    'E0301': "Authentication token invalid. Please sign in again.",
    'E0302': "Authentication token not present in request. Please try again.",
    'E0303': "CSRF token not present in request. Please try again.",
    'E0304': "CSRF token mismatch. Please try again."
}