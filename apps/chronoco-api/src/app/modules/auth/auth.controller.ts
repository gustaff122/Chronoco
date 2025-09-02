import { Body, Controller, Delete, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UserResponse } from './models/user-response';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IRequest } from '../../models/i-request';
import { Response } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  public async register(@Body() registerDto: RegisterDto): Promise<UserResponse> {
    return this.authService.register(registerDto);
  }


  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Login successful.',
    type: UserResponse,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  public async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponse> {
    const { user, accessToken } = await this.authService.login(loginDto);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env['HTTPS_COOKIES_SECURE'] === 'true',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 3,
    });

    return user;
  }

  @Get('self')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User info retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  public async getSelf(@Req() req: IRequest): Promise<UserResponse> {
    const userId = req?.user['id'];
    return this.authService.findOneByIdWithoutPassword(userId);
  }

  @Delete('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User logged out successfully.' })
  public async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env['HTTPS_COOKIES_SECURE'] === 'true',
      sameSite: 'lax',
    });
  }
}