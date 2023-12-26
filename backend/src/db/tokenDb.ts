import User from '../entity/user';
import {dataSource} from '../data-source';
import Token from '../entity/token';
import {TOKEN_TYPE} from '../entity/enum/tokenType';
import moment from 'moment';

export interface ITokenDb {
  createToken: (
    user: User,
    tokenType: TOKEN_TYPE,
    expiryTimeFromNow: number
  ) => Promise<Token>;
  getToken: (tokenId: string) => Promise<Token | null>;
  saveToken: (token: Token) => Promise<Token>;
  invalidateToken: (userId: string, tokenType: TOKEN_TYPE) => Promise<void>;
}

export class TokenDb implements ITokenDb {
  tokenRepo = dataSource.getRepository(Token);

  public async createToken(
    user: User,
    tokenType: TOKEN_TYPE,
    expiryTimeFromNow: number
  ): Promise<Token> {
    const token: Token = await this.tokenRepo.create({
      user: user,
      type: tokenType,
      expiryDate: moment().add(expiryTimeFromNow),
    });

    const savedToken: Token = await this.tokenRepo.save(token);
    return savedToken;
  }

  public async getToken(tokenId: string): Promise<Token | null> {
    const token: Token | null = await this.tokenRepo
      .createQueryBuilder('token')
      .select('token')
      .leftJoinAndSelect('token.user', 'user')
      .where('token.id = :id', {id: tokenId})
      .getOne();

    return token;
  }

  public async saveToken(token: Token): Promise<Token> {
    const savedToken: Token = await this.tokenRepo.save(token);
    return savedToken;
  }

  public async invalidateToken(
    userId: string,
    tokenType: TOKEN_TYPE
  ): Promise<void> {
    await this.tokenRepo.update(
      {user: {id: userId}, type: tokenType, isValid: true},
      {isValid: false}
    );
  }
}
