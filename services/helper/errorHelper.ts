import Router from "next/router"
import { ResponseModel } from "../../models/responseModel"
import { extractErrorMessage } from "./apiHelper"

export async function errorHelper(error: any): Promise<ResponseModel> {
    if (error.response?.status === 401 && Router.pathname !== '/login') {
        Router.push("/login")
    } 
    
    return {
        isSuccess: false,
        errorCode: extractErrorMessage(error.response)
    }
}