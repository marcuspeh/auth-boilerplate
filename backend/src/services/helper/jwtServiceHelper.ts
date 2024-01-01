import jwt from 'jsonwebtoken';

import constant from '../../constant';
import Token from '../../entity/token';

class JwtServiceHelper {
  public async signJwtToken(token: Token): Promise<string> {
    const payload = {
      userId: token.user.id,
      tokenId: token.id,
      expiryDate: token.expiryDate,
    };

    const jwtToken: string = jwt.sign(
      payload,
      process.env.JWT_SECRET || constant.EMPTY_STRING
    );
    return jwtToken;
  }
}

export default new JwtServiceHelper();
