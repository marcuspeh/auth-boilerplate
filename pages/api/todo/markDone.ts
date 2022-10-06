import type { NextApiRequest, NextApiResponse } from 'next'
import { getHeader } from '../../../apiController/apiUtilities'
import customAxios from '../../../utilities/customAxios'

type Data = {
  id: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'PATCH') {
    return res.status(404)
  }
  
  try {
    const result = await customAxios.patch(process.env.BACKEND_URL + "/todo/markDone", req.body, {headers: getHeader(req)})

    res.status(200).json(result.data)
  } catch (err: any) {
    res.status(err.response.status).json(err.response.data)
  }
}
