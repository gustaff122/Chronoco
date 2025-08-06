import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/users.dto';
import { UsersService } from './users.service';
import { PaginatedResponse } from './models/paginated-response';
import { PaginationDto } from '../../interfaces/pagination.dto';
import { Users } from '../../entities/users.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Get()
  @ApiResponse({ status: 200, description: 'User list retrieved successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  public async findAll(@Query() query: PaginationDto): Promise<PaginatedResponse<UserResponseDto>> {
    return this.usersService.findAll(query);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  @ApiBody({ type: CreateUserDto })
  public async create(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.usersService.create(createUserDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  public async delete(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBody({ type: UpdateUserDto })
  public async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return await this.usersService.update(id, updateUserDto);
  }
}
