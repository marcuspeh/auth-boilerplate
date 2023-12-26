import axios, { AxiosError } from "axios"

const defaultOptions = {
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'apitoken': process.env.API_KEY || "",
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL || "",
        'Cache-Control': "no-store",
    },
  };

const customAxios = axios.create(defaultOptions)


export default customAxios