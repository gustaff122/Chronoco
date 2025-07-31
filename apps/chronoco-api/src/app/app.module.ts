import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Users } from './entities/users.entity';
import { UsersModule } from './modules/users/users.module';

const ENTITIES = [
  Users,
];

const MODULES = [
  AuthModule,
  UsersModule,
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
