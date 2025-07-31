import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../entities/users.entity';
import { Like, Repository } from 'typeorm';
import { UserQueryDto } from './dto/users.dto';
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
}