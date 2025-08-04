import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../entities/users.entity';
import { Like, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto, UserQueryDto, UserResponseDto } from './dto/users.dto';
import { PaginatedResponse } from './models/paginated-response';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {
  }

  public async findAll(query: UserQueryDto): Promise<PaginatedResponse<Users>> {
    const { page = 1, limit = 10, search } = query;

    const [ items, total ] = await this.usersRepository.findAndCount({
      where: search ? [
        { login: Like(`%${search}%`) },
        { name: Like(`%${search}%`) },
      ] : [],
      take: limit,
      skip: (page - 1) * limit,
      order: { login: 'ASC' },
    });

    return {
      data: items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }


  public async create(user: CreateUserDto): Promise<Users> {
    const usersCount = await this.usersRepository.count();

    const newUser = this.usersRepository.create({
      ...user,
      role: usersCount === 0 ? 'ADMIN' : 'USER',
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