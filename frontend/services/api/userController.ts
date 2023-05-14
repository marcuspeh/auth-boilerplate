import { ResponseModel } from "../../models/responseModel"
import customAxios from "../../utilities/customAxios"
import { extractErrorMessage } from "../helper/apiHelper"
import { errorHelper } from "../helper/errorHelper"

export async function loginUser(email: string, password: string): Promise<ResponseModel> {
    try {
        const result = await customAxios
            .post("/api/user/login", {
                email: email,
                password: password
            })
        return {
            isSuccess: true,
            errorCode: ""
        }
    } catch (err: any) {
        return errorHelper(err)
    }
}

export async function registerUser(name: string, email: string, password: string): Promise<ResponseModel> {
    try {
        const result = await customAxios
            .post("/api/user/register", {
                email: email,
                name: name,
                password: password
            })
            
        return {
            isSuccess: true,
            errorCode: ""
        }
    } catch (err: any) {
        return errorHelper(err)
    }
}

export async function logoutUser(): Promise<ResponseModel> {
    try {
        const result = await customAxios
            .post("/api/user/logout")

        return {
            isSuccess: true,
            errorCode: ""
        }
    } catch (err: any) {
        return errorHelper(err)
    }
}