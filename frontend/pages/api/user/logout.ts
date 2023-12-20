import type { NextApiRequest, NextApiResponse } from 'next'
import { getHeader } from '../../../apiController/apiUtilities'
import customAxios from '../../../utilities/customAxios'
import { serialize } from 'cookie'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(404)
  }
  
  try {
    const result = await customAxios.post(process.env.BACKEND_URL + "/user/logout", {}, {headers: getHeader(req)})

    res.setHeader('Set-Cookie', [
      serialize('GIN', "", { path: "/" }),
    ])

    res.status(200).json(result.data)
  } catch (err: any) {
    res.status(err.response.status).json(err.response.data)
  }
}
