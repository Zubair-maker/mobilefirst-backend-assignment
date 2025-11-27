import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import type { PoolConfig } from 'mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    const databaseUrl = configService.get<string>('DATABASE_URL');
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    // Check if it's a Prisma Accelerate URL
    const isAccelerateUrl = databaseUrl.startsWith('prisma+');
    
    const clientOptions: any = {
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    };

    if (isAccelerateUrl) {
      // Use Prisma Accelerate
      clientOptions.accelerateUrl = databaseUrl;
    } else {
      // Parse MySQL connection URL
      // Format: mysql://user:password@host:port/database
      // Also supports: mysql://user:password@host/database (default port 3306)
      try {
        // Use URL parsing for more robust handling
        const url = new URL(databaseUrl.replace(/^mysql:/, 'http:'));
        
        const user = decodeURIComponent(url.username || 'root');
        const password = decodeURIComponent(url.password || '');
        const host = url.hostname || 'localhost';
        const port = url.port ? parseInt(url.port) : 3306; // Default MySQL port
        const database = url.pathname ? url.pathname.slice(1) : ''; // Remove leading '/'
        
        if (!database) {
          throw new Error('Database name is required in DATABASE_URL');
        }

        // Create MySQL connection config for MariaDB adapter (compatible with MySQL)
        const poolConfig: PoolConfig = {
          host,
          port,
          user,
          password,
          database,
          connectionLimit: 10,
        };

        // Create Prisma adapter using MariaDB adapter (compatible with MySQL)
        const adapter = new PrismaMariaDb(poolConfig);
        clientOptions.adapter = adapter;
      } catch (error) {
        throw new Error(
          `Invalid DATABASE_URL format: ${error instanceof Error ? error.message : String(error)}. ` +
          'Expected format: mysql://user:password@host:port/database or mysql://user:password@host/database'
        );
      }
    }
    
    super(clientOptions);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connection established');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database connection closed');
  }
}

