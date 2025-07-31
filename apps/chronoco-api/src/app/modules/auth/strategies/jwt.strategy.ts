import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: (req: Request) => req?.cookies?.['access_token'] || null,
      secretOrKey: process.env['JWT_SECRET'],
      passReqToCallback: false,
    });
  }

  async validate(payload: any) {
    const user = await this.authService.findOneById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
