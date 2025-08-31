import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { ulid } from 'ulid';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Events {
  @ApiProperty({ description: 'Unique ULID identifier', example: '01J8H4ZX5Y7R7E2JZP4D2N9Q2M' })
  @PrimaryColumn('char', { length: 26 })
  public id: string;

  @ApiProperty({ description: 'Event name', maxLength: 256, example: 'Angular Conference 2025' })
  @Column({ length: 256 })
  public name: string;

  @ApiPropertyOptional({ description: 'Subtitle', maxLength: 256, example: 'Biggest Angular event in Europe' })
  @Column({ length: 256, nullable: true })
  public subtitle: string;

  @ApiPropertyOptional({ description: 'Start date', type: String, format: 'date-time', example: '2025-09-01T09:00:00Z' })
  @Column({ type: 'timestamp', nullable: true })
  public dateFrom: Date;

  @ApiPropertyOptional({ description: 'End date', type: String, format: 'date-time', example: '2025-09-01T17:00:00Z' })
  @Column({ type: 'timestamp', nullable: true })
  public dateTo: Date;

  @ApiPropertyOptional({ description: 'Address', maxLength: 512, example: 'Warsaw, Conference Center XYZ' })
  @Column({ length: 512, nullable: true })
  public address: string;

  @ApiPropertyOptional({ description: 'Max capacity', example: 200 })
  @Column({ type: 'int', nullable: true })
  public maxCapacity: number;

  @ApiPropertyOptional({ description: 'Approximate price', example: '200 PLN' })
  @Column({ length: 128, nullable: true })
  public approximatePrice: string;

  @ApiPropertyOptional({ description: 'Description', example: 'Full-day Angular event with workshops.' })
  @Column({ type: 'text', nullable: true })
  public description: string;

  @BeforeInsert()
  generateId() {
    this.id = ulid();
  }
}
