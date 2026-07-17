import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateOperationDto {
  @ApiProperty({
    example: 'uuid товара',
  })
  @IsString()
  productId!: string;

  @ApiProperty({
    example: 10,
  })
  @IsInt()
  quantity!: number;

  @ApiProperty({
    example: '2026-07-17',
  })
  @IsString()
  operationDate!: string;
}
