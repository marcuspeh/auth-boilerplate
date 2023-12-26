import axios from "axios"
import { ResponseModel } from "../../models/responseModel"
import customAxios from "../../utilities/customAxios"
import { errorHelper } from "../helper/errorHelper"

export async function loginUser(email: string, password: string): Promise<ResponseModel> {
    try {
        const result = await axios
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

export async function checkAuth(): Promise<ResponseModel> {
    try {
        const result = await customAxios
            .get("/api/user/checkAuth")

        return {
            isSuccess: true,
            errorCode: ""
        }
    } catch (err: any) {
        return errorHelper(err)
    }
}