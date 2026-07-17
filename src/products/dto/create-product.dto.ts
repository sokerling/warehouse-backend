import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'ART-001',
  })
  @IsString()
  article!: string;

  @ApiProperty({
    example: 'Keyboard',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'Mechanical keyboard',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
