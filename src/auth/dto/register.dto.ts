import { IsString } from 'class-validator';

export class RegisterDto {
  name!: string;

  @IsString()
  email!: string;

  password!: string;
}
