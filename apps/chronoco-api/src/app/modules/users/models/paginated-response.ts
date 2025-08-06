import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponse<T> {
  @ApiProperty({
    example: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
    ],
    description: 'List of users',
  })
  items: T[];

  @ApiProperty()
  pager: {
    totalItems: number,
    currentPage: number,
    limit: number,
    totalPages: number,
  };
}