import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({ example: '123', description: 'Unique user ID' })
  id: string;

  @ApiProperty({ example: 'Jan Kowalski', description: 'User display name' })
  name: string;

  @ApiProperty({ example: 'jankowalski', description: 'Login or email' })
  login: string;
}