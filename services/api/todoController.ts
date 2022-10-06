import { ResponseModel } from "../../models/responseModel"
import customAxios from "../../utilities/customAxios"
import { errorHelper } from "../helper/errorHelper"

export async function getUndone(): Promise<ResponseModel> {
    try {
        const result = await customAxios
            .get("/api/todo/getUndone")
        return {
            isSuccess: true,
            errorCode: "",
            data: result.data.todos
        }
    } catch (err: any) {
        return errorHelper(err)
    }
}
    
export async function getDone(): Promise<ResponseModel> {
    try {
        const result = await customAxios
            .get("/api/todo/getDone")
        return {
            isSuccess: true,
            errorCode: "",
            data: result.data.todos
        }
    } catch (err: any) {
        return errorHelper(err)
    }
}


export async function getAll(): Promise<ResponseModel> {
    try {
        const result = await customAxios
            .get("/api/todo/getAll")
        return {
            isSuccess: true,
            errorCode: "",
            data: result.data.todos
        }
    } catch (err: any) {
        return errorHelper(err)
    }
}

export async function markDone(todoId: string): Promise<ResponseModel> {
    try {
        const result = await customAxios
            .patch("/api/todo/markDone", {
                id: todoId
            })
        return {
            isSuccess: true,
            errorCode: ""
        }
    } catch (err: any) {
        return errorHelper(err)
    }
}

export async function markUndone(todoId: string): Promise<ResponseModel> {
    try {
        const result = await customAxios
            .patch("/api/todo/markUndone", {
                id: todoId
            })
        return {
            isSuccess: true,
            errorCode: ""
        }
    } catch (err: any) {
        return errorHelper(err)
    }
}

export async function deleteTodo(todoId: string): Promise<ResponseModel> {
    try {
        const result = await customAxios
            .patch("/api/todo/delete", {
                id: todoId
            })
        return {
            isSuccess: true,
            errorCode: ""
        }
    } catch (err: any) {
        return errorHelper(err)
    }
}

export async function saveTodo(todoId: string, title: string, body: string): Promise<ResponseModel> {
    try {
        const result = await customAxios
            .patch("/api/todo/update", {
                id: todoId,
                title: title,
                task: body
            })
        return {
            isSuccess: true,
            errorCode: ""
        }
    } catch (err: any) {
        return errorHelper(err)
    }
}
export async function createNewTodo(title: string, body: string): Promise<ResponseModel> {
    try {
        const result = await customAxios
            .post("/api/todo/createNew", {
                title: title,
                task: body
            })
        return {
            isSuccess: true,
            errorCode: ""
        }
    } catch (err: any) {
        return errorHelper(err)
    }
}