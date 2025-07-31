import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../../entities/users.entity';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserResponse } from './models/user-response';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {
  }

  public async register(registerDto: RegisterDto): Promise<UserResponse> {
    const { login, password, name } = registerDto;

    const existingUser = await this.usersRepository.findOne({ where: { login } });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      name,
      login,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);
    return { id: user.id, login, name };
  }

  public async login(loginDto: LoginDto): Promise<{ user: UserResponse, accessToken: string }> {
    const { login, password } = loginDto;

    const user = await this.validateUser(login, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, name: user.name, login: user.login };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user: payload };
  }

  public async validateUser(login: string, password: string): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { login } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  public async findOneById(userId: string): Promise<Users> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  public async findOneByIdWithoutPassword(userId: string): Promise<UserResponse> {
    const user = await this.findOneById(userId);
    const { password, ...rest } = user;
    return rest;
  }
}