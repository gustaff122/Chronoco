import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PlannersPresenceService } from './services/planners-presence.service';
import { PlannersClientMessages, PlannersSocketMessages } from './models/planners-messages.enum';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WsUser } from '../../decorators/ws-user.decorator';
import { Users } from '../../entities/users.entity';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:4200',
      'https://dev122.pl',
      /\.dev122\.pl$/,
    ],
    credentials: true,
    secure: process.env['HTTPS_COOKIES_SECURE'] === 'true',
  },
})
export class PlannersGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly presence: PlannersPresenceService) {
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage(PlannersClientMessages.JOIN_PLANNER)
  public handleJoin(
    @MessageBody() { planId }: { planId: string },
    @ConnectedSocket() client: Socket,
    @WsUser() user: Users,
  ): void {
    client.join(`plan_${planId}`);
    client.data = { planId, user };

    const users = this.presence.join(planId, user);

    client.emit(PlannersSocketMessages.PRESENCE_SNAPSHOT, { users });
    client.to(`plan_${planId}`).emit(PlannersSocketMessages.USER_JOINED, { users });
  }

  public handleDisconnect(client: Socket): void {
    const { planId, user } = client.data ?? {};
    if (!planId || !user) return;

    this.presence.leave(planId, user);
    this.server.to(`plan_${planId}`).emit(PlannersSocketMessages.USER_LEFT, { username: user.name });
  }
}