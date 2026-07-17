import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@test.com',
  })
  @IsString()
  email!: string;

  @ApiProperty({
    example: 'admin123',
  })
  @IsString()
  password!: string;
}
