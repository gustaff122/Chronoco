import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: (req: Request & { handshake?: any }) => {
        // ✅ HTTP request
        if (req?.cookies?.['access_token']) {
          return req.cookies['access_token'];
        }

        // ✅ WebSocket handshake
        const cookieHeader: string | undefined = req?.handshake?.headers?.cookie;
        if (cookieHeader) {
          const cookies = Object.fromEntries(
            cookieHeader.split(';').map(c => {
              const [ k, v ] = c.trim().split('=');
              return [ k, decodeURIComponent(v) ];
            }),
          );
          return cookies['access_token'];
        }

        return null;
      },
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
