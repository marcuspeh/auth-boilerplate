import User from '../entity/user';
import {Context} from 'koa';
import UserService from '../services/userService';
import {loginUserDTO, registerUserDTO} from './apiSchemas/userDTO';
import dtoValidator from './helper/dtoValidator';
import TokenService from '../services/tokenService';
import {TOKEN_TYPE} from '../enum/tokenType';

class UserController {
  private userService: UserService = new UserService();
  private tokenService: TokenService = new TokenService();

  public async register(ctx: Context) {
    const apiDto = await dtoValidator.inputValidate(
      registerUserDTO,
      ctx.request.body
    );
    const user: User = await this.userService.register(
      apiDto.name,
      apiDto.email,
      apiDto.password
    );

    ctx.body = {
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }

  public async login(ctx: Context) {
    const apiDto = await dtoValidator.inputValidate(
      loginUserDTO,
      ctx.request.body
    );
    const user: User = await this.userService.login(
      apiDto.email,
      apiDto.password
    );
    const jwtUserToken: string =
      await this.tokenService.generateUserToken(user);

    ctx.cookies.set('GIN', jwtUserToken, {
      httpOnly: true,
      secure: process.env.ENVIRONMENT !== 'dev',
      sameSite: 'lax',
    });

    ctx.body = {
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }

  public async logout(ctx: Context) {
    const userId: string =
      ctx.request?.header?.userId?.toString() || 'unknown user';

    await this.tokenService.invalidateToken(userId, TOKEN_TYPE.USER_TOKEN);

    ctx.cookies.set('GIN', undefined);
    ctx.cookies.set('TONIC', undefined);
    ctx.body = {
      message: 'Goodbye',
    };
  }

  public async checkAuthentication(ctx: Context) {
    ctx.body = {
      message: 'Authenticated',
    };
  }
}

export default new UserController();
