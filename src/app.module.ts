import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemController } from './test.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'vkiker',
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),
  ],
  controllers: [ItemController],
  providers: [],
})
export class AppModule {}
