import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CookieParserMiddleware } from './cookie-parser.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontendPort = process.env.FRONTEND_PORT ?? 80;

  // Uniquely port 80 adjusts the URL to http://localhost so we cover for this case
  const allowedOrigin = frontendPort === '80' 
    ? 'http://localhost' 
    : `http://localhost:${frontendPort}`;

  // For simplicity in this example project we allow requests from the frontend instead of using a reverse proxy
  // In a production environment you would likely use a reverse proxy (like nginx) to handle CORS and other security headers
  app.enableCors({
    origin: allowedOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // to allow cookies to be sent
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
