import { Module } from '@nestjs/common';
import { ConditionalModule, ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresDBConfigService } from './config/db';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    /**
     * The database is opt-in so a fresh clone (and the Lambda deploy, which has
     * no VPC/RDS wired up yet) boots without a Postgres reachable. Set
     * DB_ENABLED=true to connect — see .env.example and `pnpm db:up`.
     */
    ConditionalModule.registerWhen(
      TypeOrmModule.forRootAsync({
        useClass: PostgresDBConfigService,
        inject: [PostgresDBConfigService],
      }),
      // Predicate rather than the 'DB_ENABLED' string form on purpose: the
      // string form registers unless the value is literally "false", so an
      // unset variable would still attempt a connection. Opt-in must be explicit.
      (env) => env.DB_ENABLED === 'true',
    ),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    CacheModule.register(),
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
