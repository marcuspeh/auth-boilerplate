import { errorCode } from "./errorCode"

export default class CustomError extends Error {
    public status: number
    private code: string
    private info: string

    public constructor(code: string, info?: string) {
        super(code)
        this.code = code
        this.info = info
        
        if (code == errorCode.TOKEN_DOES_NOT_EXISTS || 
            code == errorCode.TOKEN_INVALID ||
            code == errorCode.TOKEN_EXPIRED) {
            this.status = 401
        } else {
            this.status = 400
        }
    }
}