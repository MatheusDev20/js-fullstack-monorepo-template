import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class PostgresDBConfigService implements TypeOrmOptionsFactory {
  private logger = new Logger();
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const entities = this.configService.get<string>('DB_ENTITIES');
    try {
      this.logger.log(
        'Trying to connect to the database',
        this.configService.get<string>('DB_NAME'),
      );
      this.logger.log([path.join(__dirname, '..', '..') + entities]);
      const options: TypeOrmModuleOptions = {
        type: 'postgres',
        host: this.configService.get<string>('DB_HOST'),
        username: this.configService.get<string>('DB_USERNAME'),
        port: this.configService.get<number>('DB_PORT'),
        password: this.configService.get<string>('DB_PASSWORD'),
        database: this.configService.get<string>('DB_NAME'),
        entities: [path.join(__dirname, '..', '..') + entities],
        synchronize: this.configService.get<boolean>('DB_SYNC'),

        logging: ['warn', 'info', 'log'],
      };
      return options;
    } catch (err: any) {
      this.logger.error(
        `Unhandled exception in createTypeOrmOptions: ${err.message}`,
      );
    }
  }
}
