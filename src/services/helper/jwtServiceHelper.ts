import Token from '../../entity/token'
import jwt from 'jsonwebtoken'

class JwtServiceHelper {
    public async signJwtToken(token: Token): Promise<string> {
        const payload = {
            userId: token.user.id,
            tokenId: token.id,
            expiryDate: token.expiryDate
        }
          
        const jwtToken: string = jwt.sign(
            payload,
            process.env.JWT_SECRET
        )
        return jwtToken
    }
}

export default new JwtServiceHelper()