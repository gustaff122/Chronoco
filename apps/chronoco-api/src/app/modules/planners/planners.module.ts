import { Module } from '@nestjs/common';
import { PlannersPresenceService } from './services/planners-presence.service';
import { PlannersGateway } from './planners.gateway';

@Module({
  providers: [ PlannersPresenceService, PlannersGateway ],
})
export class PlannersModule {
}
