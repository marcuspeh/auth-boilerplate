import type { NextApiRequest } from 'next'

interface jsonObect {
    [x: string]: string
}

export function getCookie(req: NextApiRequest,): string {
    return `GIN=${req.cookies.GIN};`
}

export function getTonic(req: NextApiRequest,): string {
    return req.cookies.GIN || ''
}

export function getHeader(req: NextApiRequest): jsonObect {
    return {
        TONIC: getTonic(req), 
        Cookie: getCookie(req)
    }
}