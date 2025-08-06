import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../entities/users.entity';
import { Like, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/users.dto';
import { PaginatedResponse } from './models/paginated-response';
import { PaginationDto } from '../../interfaces/pagination.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {
  }

  public async findAll(query: PaginationDto): Promise<PaginatedResponse<Users>> {
    const { page = 1, limit = 10, search } = query;

    const [ items, total ] = await this.usersRepository.findAndCount({
      where: search ? [
        { login: Like(`%${search}%`) },
        { name: Like(`%${search}%`) },
      ] : [],
      take: limit,
      skip: (page - 1) * limit,
      order: { login: 'ASC' },
      select: [ 'id', 'login', 'name', 'role' ],
    });

    return {
      items,
      pager: {
        totalItems: total,
        currentPage: page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }


  public async create(user: CreateUserDto): Promise<Users> {
    const existingUser = await this.usersRepository.findOne({ where: { login: user.login } });
    if (existingUser) {
      throw new ConflictException('User with this login already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.usersRepository.create({
      ...user,
      password: hashedPassword,
    });
    return await this.usersRepository.save(newUser);
  }


  public async findByLogin(login: string): Promise<Users> {
    return await this.usersRepository.findOne({ where: { login } });
  }

  public async delete(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.delete(id);
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);

    const updatedUser = await this.usersRepository.save(user);

    return {
      id: updatedUser.id,
      login: updatedUser.login,
      name: updatedUser.name,
      role: updatedUser.role,
    };
  }
}