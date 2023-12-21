import {IsDefined, IsEmail, IsString} from 'class-validator';

export class registerUserDTO {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  password: string;
}

export class loginUserDTO {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  password: string;
}
