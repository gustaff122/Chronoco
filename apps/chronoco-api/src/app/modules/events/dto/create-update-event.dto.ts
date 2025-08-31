import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @ApiProperty({ description: 'Event name', maxLength: 256, example: 'Angular Conference 2025' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 256)
  public name: string;

  @ApiPropertyOptional({ description: 'Event subtitle', maxLength: 256, example: 'The biggest Angular event in Europe' })
  @IsString()
  @IsOptional()
  @MaxLength(256)
  public subtitle?: string;

  @ApiPropertyOptional({ description: 'Event start date', type: String, format: 'date-time', example: '2025-09-01T09:00:00Z' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  public dateFrom?: Date;

  @ApiPropertyOptional({ description: 'Event end date', type: String, format: 'date-time', example: '2025-09-01T17:00:00Z' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  public dateTo?: Date;

  @ApiPropertyOptional({ description: 'Event address', maxLength: 512, example: 'Warsaw, Conference Center XYZ' })
  @IsString()
  @IsOptional()
  @MaxLength(512)
  public address?: string;

  @ApiPropertyOptional({ description: 'Maximum participants capacity', example: 200 })
  @IsInt()
  @IsOptional()
  public maxCapacity?: number;

  @ApiPropertyOptional({ description: 'Approximate price (string, can include currency)', maxLength: 128, example: '200 PLN' })
  @IsString()
  @IsOptional()
  @MaxLength(128)
  public approximatePrice?: string;

  @ApiPropertyOptional({ description: 'Event description', example: 'Full-day event about Angular best practices.' })
  @IsString()
  @IsOptional()
  public description?: string;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {
}