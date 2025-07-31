import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserQueryDto } from './dto/users.dto';
import { UsersService } from './users.service';
import { PaginatedResponse } from './models/paginated-response';
import { Users } from '../../entities/users.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Get()
  @ApiResponse({ status: 200, description: 'User list retrieved successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async findAll(@Query() query: UserQueryDto): Promise<PaginatedResponse<Users>> {
    return this.usersService.findAll(query);
  }
}
