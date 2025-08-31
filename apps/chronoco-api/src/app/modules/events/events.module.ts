import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Events } from '../../entities/events.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Events ]),
  ],
  controllers: [ EventsController ],
  providers: [ EventsService ],
})
export class EventsModule {
}
