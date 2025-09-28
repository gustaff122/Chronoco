import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Users } from '../entities/users.entity';

export const WsUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient();
    return client?.user as Users;
  },
);