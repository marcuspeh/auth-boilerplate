import User from "../entity/user"
import { Context } from "koa"
import UserService from "../services/userService"
import { loginUserDTO, registerUserDTO } from "./apiSchemas/userDTO"
import dtoValidator from "./helper/dtoValidator"
import TokenService from "../services/tokenService"
import { TOKEN_TYPE } from "../entity/enum/tokenType"

class UserController {
    private userService: UserService = new UserService()
    private tokenService: TokenService = new TokenService()

    public async register(ctx: Context) {
        const apiDto = await dtoValidator.inputValidate(registerUserDTO, ctx.request.body)
        const user: User = await this.userService.register(apiDto.name, apiDto.email, apiDto.password)

        ctx.body = {
            user: {
                name: user.name,
                email: user.email
            }
        }
    }

    public async login(ctx: Context) {
        const apiDto = await dtoValidator.inputValidate(loginUserDTO, ctx.request.body)
        const user: User = await this.userService.login(apiDto.email, apiDto.password)

        const jwtUserToken: string = await this.tokenService.generateUserToken(user)
        const jwtUserCsrfToken: string = await this.tokenService.generateUserTokenCsrf(user)

        const isDev: boolean = process.env.ENVIRONMENT === 'dev'
        ctx.cookies.set("GIN", jwtUserToken, {
            httpOnly: true,
            secure: !isDev,
            sameSite: "strict"
        })
        ctx.cookies.set("TONIC", jwtUserCsrfToken, {
            httpOnly: false,
            secure: !isDev,
            sameSite: "strict"
        })
        ctx.body = {
            user: {
                name: user.name,
                email: user.email
            }
        }
    }

    public async logout(ctx: Context) {
        const userId = ctx.request.header.userId.toString()

        await this.tokenService.invalidateToken(userId, TOKEN_TYPE.USER_TOKEN)
        await this.tokenService.invalidateToken(userId, TOKEN_TYPE.USER_CSRF_TOKEN)

        
        ctx.cookies.set("GIN", undefined)
        ctx.cookies.set("TONIC", undefined)
        ctx.body = {
            message: "Goodbye"
        }
    }
}

export default new UserController()