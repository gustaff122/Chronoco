import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Users } from './entities/users.entity';
import { Events } from './entities/events.entity';
import { EventsModule } from './modules/events/events.module';

const ENTITIES = [
  Users,
  Events,
];

const MODULES = [
  AuthModule,
  EventsModule,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env['DB_HOST'],
      port: +process.env['DB_PORT'],
      username: process.env['DB_USERNAME'],
      password: process.env['DB_PASSWORD'],
      database: process.env['DB_DATABASE'],
      entities: ENTITIES,
      synchronize: true,
    }),
    ...MODULES,
  ],
})
export class AppModule {
}
