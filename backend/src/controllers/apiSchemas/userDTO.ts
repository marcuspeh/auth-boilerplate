import {IsDefined, IsEmail, IsString, isString} from 'class-validator';

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

export class updatePasswordDTO {
  @IsDefined()
  @IsString()
  originalPassword: string;

  @IsDefined()
  @IsString()
  newPassword: string;
}

export class forgetPasswordDTO {
  @IsDefined()
  @IsString()
  email: string;
}

export class resetPasswordDTO {
  @IsDefined()
  @IsString()
  newPassword: string;
}
