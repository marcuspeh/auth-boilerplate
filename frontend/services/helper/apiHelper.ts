import { ErrorMapping } from "../../utilities/errorMessageMapping"

export function extractErrorCode(err: any): string {
    if (err && err.data && err.data.error && err.data.error.code) {
        return err.data.error.code
    }
    return ""
}

export function extractErrorMessage(err: any): string {
    const errorCode: string = extractErrorCode(err)
    if (errorCode) {
        return ErrorMapping[errorCode] || ""
    }
    return ""
}
