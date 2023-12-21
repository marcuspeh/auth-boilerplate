import {IsDefined, IsString} from 'class-validator';

export class encryptionDTO {
  @IsDefined()
  @IsString()
  text: string;
}

export class hashingDTO {
  @IsDefined()
  @IsString()
  password: string;
}

export class checkHashingDTO {
  @IsDefined()
  @IsString()
  password: string;

  @IsDefined()
  @IsString()
  passwordHash: string;
}
