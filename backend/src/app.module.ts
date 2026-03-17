import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbPort = Number(configService.get('DB_PORT') ?? 5432);

        return {
          type: 'postgres' as const,
          host: configService.get<string>('DB_HOST') ?? 'localhost',
          port: Number.isNaN(dbPort) ? 5432 : dbPort,
          username: configService.get<string>('DB_USERNAME') ?? 'postgres',
          password: configService.get<string>('DB_PASSWORD') ?? 'postgres',
          database: configService.get<string>('DB_DATABASE') ?? 'brewbuddy',
          autoLoadEntities: true,
          synchronize: (configService.get<string>('DB_SYNCHRONIZE') ?? 'true') === 'true',
        };
      },
    }),
    RecipesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
