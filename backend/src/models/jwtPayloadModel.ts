export default class JwtPayloadModel {
  public userId: string;
  public tokenId: string;
  public expiry: Date;

  private constructor(userId: string, tokenId: string, expiry: Date) {
    this.userId = userId;
    this.tokenId = tokenId;
    this.expiry = expiry;
  }

  public static from(input: any): JwtPayloadModel {
    return new JwtPayloadModel(input.userId, input.tokenId, input.expiryDate);
  }
}
