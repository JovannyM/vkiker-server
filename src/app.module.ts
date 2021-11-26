import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestController } from './test.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5775,
      username: 'postgres',
      password: 'postgres',
      database: 'vkiker',
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),
    AuthModule,
  ],
  controllers: [TestController],
})
export class AppModule {}
