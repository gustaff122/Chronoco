import { IsOptional, IsPositive } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  limit?: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  search?: string;
}