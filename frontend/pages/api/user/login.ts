import type { NextApiRequest, NextApiResponse } from 'next'
import customAxios from '../../../utilities/customAxios';
import { encryptPassword } from '../../../apiController/helper/rsaHelper';

type Data = {
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

    const result = await customAxios.post(process.env.BACKEND_URL + "/user/login", req.body)
    res.setHeader('Set-Cookie', result.headers['set-cookie'] || "")
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('Strict-Transport-Security', 'max-age=314360000')

    res.status(200).json(result.data)
  } catch (err: any) {
    res.status(err.response.status).json(err.response.data)
  }
}
