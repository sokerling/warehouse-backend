import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
  })
  @IsString()
  email!: string;

  @ApiProperty({
    example: 'password123',
  })
  @IsString()
  password!: string;

  @ApiProperty({
    example: 'WAREHOUSE',
  })
  @IsString()
  role!: string;
}
