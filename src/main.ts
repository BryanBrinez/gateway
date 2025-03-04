import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { environmentsVariables } from './config/environments';
import { ExceptionFilter } from './common/exceptions/rpc-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Gateway');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new ExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 🔹 Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('Documentación del API Gateway en NestJS')
    .setVersion('1.0')
    .addBearerAuth() // Agregar autenticación JWT si es necesario
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(environmentsVariables.port);
  logger.log(`Server running on port ${environmentsVariables.port}`);
  logger.log(
    `Swagger available at http://localhost:${environmentsVariables.port}/api/docs`,
  );
}

bootstrap();
