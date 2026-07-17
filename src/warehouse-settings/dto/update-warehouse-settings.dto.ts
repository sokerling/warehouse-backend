import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateWarehouseSettingsDto {
  @ApiProperty({
    example: 1000,
  })
  @IsInt()
  @Min(1)
  capacity!: number;
}
