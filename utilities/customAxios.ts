import axios, { AxiosError } from "axios"

const customAxios = axios.create({})

customAxios.interceptors.request.use((config) => {
    config.withCredentials = true
    config.headers = {
        'Content-Type': 'application/json',
        APITOKEN: process.env.API_KEY || "",
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL || "",
        'Cache-Control': "no-store",
        ...config.headers
    }
    return config
})

export default customAxios