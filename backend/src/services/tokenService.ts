import {TokenDb} from '../db/tokenDb';
import {TOKEN_TYPE} from '../entity/enum/tokenType';
import CustomError from '../errors/customError';
import {errorCode} from '../errors/errorCode';
import Token from '../entity/token';
import User from '../entity/user';
import jwtServiceHelper from './helper/jwtServiceHelper';
import tokenServiceHelper from './helper/tokenServiceHelper';

export default class TokenService {
  private tokenDb: TokenDb = new TokenDb();

  public async generateUserToken(user: User): Promise<string> {
    await this.tokenDb.invalidateToken(user.id, TOKEN_TYPE.USER_TOKEN);

    const expiryTimeFromNow: number =
      Number(process.env.MAX_USER_TOKEN_VALIDITY_SECONDS) || 360;
    const userToken: Token = await this.tokenDb.createToken(
      user,
      TOKEN_TYPE.USER_TOKEN,
      expiryTimeFromNow
    );
    const userTokenJwt: string = await jwtServiceHelper.signJwtToken(userToken);
    return userTokenJwt;
  }

  public async verifyToken(
    tokenId: string,
    userId: string,
    tokenType: TOKEN_TYPE
  ): Promise<Token> {
    const token: Token | null = await this.tokenDb.getToken(tokenId);

    if (token === null) {
      throw new CustomError(errorCode.TOKEN_DOES_NOT_EXISTS);
    }

    if (token.user.id !== userId) {
      throw new CustomError(errorCode.TOKEN_INVALID);
    }

    await tokenServiceHelper.isValid(token, tokenType, true);

    return token;
  }

  public async invalidateToken(
    userId: string,
    tokenType: TOKEN_TYPE
  ): Promise<void> {
    await this.tokenDb.invalidateToken(userId, tokenType);
  }

  public async invalidateExpiredToken(): Promise<void> {
    await this.tokenDb.invalidateExpiredToken();
  }
}
