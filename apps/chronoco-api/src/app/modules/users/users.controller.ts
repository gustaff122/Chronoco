import { BadRequestException, Body, ConflictException, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, UserQueryDto, UserResponseDto } from './dto/users.dto';
import { UsersService } from './users.service';
import { PaginatedResponse } from './models/paginated-response';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Get()
  @ApiResponse({ status: 200, description: 'User list retrieved successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async findAll(@Query() query: UserQueryDto): Promise<PaginatedResponse<UserResponseDto>> {
    const result = await this.usersService.findAll(query);
    return {
      ...result,
      data: result.data.map(user => ({
        id: user.id,
        login: user.login,
        name: user.name,
        role: user.role,
      })),
    };
  }

  @Post()

  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 409, description: 'User already exists.' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const existing = await this.usersService.findByLogin(createUserDto.login);
      if (existing) {
        throw new ConflictException('User already exists.');
      }
      return await this.usersService.create(createUserDto);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async delete(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBody({ type: UpdateUserDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }
}
