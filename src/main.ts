import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import * as path from 'path';

(async () => {
  const port = process.env.APP_PORT || 8085;
  const origin = ["'self'"];

  // Fastify app
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule, new FastifyAdapter({
      bodyLimit: 26214400 /*25MB*/,
      forceCloseConnections: true
    }));

  // Public assets
  app.useStaticAssets({
    root: path.join(__dirname, '..', 'public'),
    prefix: '/public/',
  });

  app.enableShutdownHooks();

  // Cors
  app.enableCors({
    origin: origin,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE'],
  });

  // Ready
  await app.listen(port, '0.0.0.0', () => {
    console.log(`\n🚀 Ready on port ${port}`);
  });
})();
