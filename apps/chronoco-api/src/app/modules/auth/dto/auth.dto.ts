import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(64)
  @MinLength(1)
  login: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(64)
  @MinLength(1)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(64)
  password: string;
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  @MaxLength(64)
  @MinLength(5)
  login: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(64)
  password: string;
}