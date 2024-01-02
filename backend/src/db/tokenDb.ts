import moment from 'moment';

import {dataSource} from '../data-source';
import Token from '../entity/token';
import {TOKEN_TYPE} from '../enum/tokenType';
import User from '../entity/user';

const tokenRepo = dataSource.getRepository(Token);

async function createToken(
  user: User,
  tokenType: TOKEN_TYPE,
  expiryTimeFromNow: number
): Promise<Token> {
  const token: Token = tokenRepo.create({
    user: user,
    type: tokenType,
    expiryDate: moment().add(expiryTimeFromNow, 'second'),
  });

  const savedToken: Token = await tokenRepo.save(token);
  return savedToken;
}

async function getToken(tokenId: string): Promise<Token | null> {
  const token: Token | null = await tokenRepo
    .createQueryBuilder('token')
    .select('token')
    .leftJoinAndSelect('token.user', 'user')
    .where('token.id = :id', {id: tokenId})
    .getOne();

  return token;
}

async function saveToken(token: Token): Promise<Token> {
  const savedToken: Token = await tokenRepo.save(token);
  return savedToken;
}

async function invalidateToken(
  userId: string,
  tokenType: TOKEN_TYPE
): Promise<void> {
  await tokenRepo.update(
    {user: {id: userId}, type: tokenType, isValid: true},
    {isValid: false}
  );
}

async function invalidateExpiredToken(): Promise<void> {
  await tokenRepo
    .createQueryBuilder('token')
    .update(Token)
    .set({isValid: false})
    .where('expiryDate < :time', {time: moment()})
    .andWhere('isValid = true')
    .execute();
}

export default {
  createToken,
  getToken,
  saveToken,
  invalidateToken,
  invalidateExpiredToken,
};
