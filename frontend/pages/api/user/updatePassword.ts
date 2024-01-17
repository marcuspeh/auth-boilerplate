import type { NextApiRequest, NextApiResponse } from 'next'
import customAxios from '../../../utilities/customAxios';
import { encryptPassword } from '../../../apiController/helper/rsaHelper';
import { getHeader } from '../../../apiController/apiUtilities'

type Data = {
  email: string
  password: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.status(404)
    return
  }
  try {
    req.body.originalPassword = await encryptPassword(req.body.originalPassword)
    req.body.newPassword = await encryptPassword(req.body.newPassword)

    const result = await customAxios.post(process.env.BACKEND_URL + "/auth/updatePassword", req.body, {headers: getHeader(req)})

    res.status(200).json(result.data)
  } catch (err: any) {
    res.status(err.response.status).json(err.response.data)
  }
}
