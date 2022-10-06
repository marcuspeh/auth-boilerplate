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

    /* Todo error code */
    "E0100": "To do is not found",

    /* Crypto error code */
    "E0200": "E0200. Please contact administrator.",

    /* User error code */
    "E0300": "Credentials does not match.",
    "E0301": "Email is invalid.",
    "E0302": "Email is already registered. Please sign in.",
    "E0303": "Please use a stronger password.",
    "E0304": "User not found",

    /* Token error code */
    "E0400": "E0400. Please login again.",
    "E0401": "E0401. Please login again",
    "E0402": "E0402. Please login again."
}