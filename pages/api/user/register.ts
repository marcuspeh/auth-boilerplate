import type { NextApiRequest, NextApiResponse } from 'next'
import customAxios from '../../../utilities/customAxios'
import { encryptPassword } from '../../../apiController/helper/rsaHelper'

type Data = {
  name: string
  email: string
  password: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(404)
  }
  
  try {
    req.body.password = await encryptPassword(req.body.password)

    const result = await customAxios.post(process.env.BACKEND_URL + "/user/register", req.body)

    res.status(200).json(result.data)
  } catch (err: any) {
    res.status(err.response.status).json(err.response.data)
  }
}
