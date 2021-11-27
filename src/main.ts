/* eslint-disable @typescript-eslint/naming-convention,@typescript-eslint/no-var-requires */
import { NestFactory } from '@nestjs/core';
import * as admin from 'firebase-admin';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = require('../secret-token-firebase.json');

  admin.initializeApp({
    credential: admin.credential.cert(config),
  });

  await app.listen(4000, '0.0.0.0');
}
bootstrap();
