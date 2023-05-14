import jwt from 'jsonwebtoken'
import { errorCode } from "../errors/errorCode"
import { Context } from "koa"
import CustomError from '../errors/customError'
import TokenService from '../services/tokenService'
import { TOKEN_TYPE } from '../entity/enum/tokenType'
import Token from '../entity/token'
import JwtPayloadModel from '../models/jwtPayloadModel'

const tokenService: TokenService = new TokenService()

const validateToken = async (ctx: Context, token: any, tokenType: TOKEN_TYPE) => {
    if (!token) {
        throw new CustomError(errorCode.TOKEN_DOES_NOT_EXISTS)
    }

    var payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);    
    } catch (e) {
        throw new CustomError(errorCode.TOKEN_EXPIRED)
    }

    const jwtPayloadModel: JwtPayloadModel = JwtPayloadModel.from(payload)
    const tokenObject: Token = await tokenService.verifyToken(jwtPayloadModel.tokenId, jwtPayloadModel.userId, tokenType)

    if (tokenType === TOKEN_TYPE.USER_TOKEN) {
        ctx.request.header.userId = tokenObject.user.id
        ctx.request.header.tokenId = tokenObject.id
        ctx.request.header.expiryDate = tokenObject.expiryDate.toString()
        
    }
    
}

const auth = async (ctx: Context, next: any) => {
    const token = ctx.cookies.get("GIN")
    const tokenCsrf = ctx.request.header.tonic

    await validateToken(ctx, token, TOKEN_TYPE.USER_TOKEN)
    await validateToken(ctx, tokenCsrf, TOKEN_TYPE.USER_CSRF_TOKEN)

    await next()
}

export default auth