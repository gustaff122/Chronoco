import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
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