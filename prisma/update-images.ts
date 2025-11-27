import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import type { PoolConfig } from 'mariadb';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Prisma Client with adapter (same as PrismaService)
function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  // Check if it's a Prisma Accelerate URL
  const isAccelerateUrl = databaseUrl.startsWith('prisma+');
  
  const clientOptions: any = {};

  if (isAccelerateUrl) {
    // Use Prisma Accelerate
    clientOptions.accelerateUrl = databaseUrl;
  } else {
    // Parse MySQL connection URL
    try {
      const url = new URL(databaseUrl.replace(/^mysql:/, 'http:'));
      
      const user = decodeURIComponent(url.username || 'root');
      const password = decodeURIComponent(url.password || '');
      const host = url.hostname || 'localhost';
      const port = url.port ? parseInt(url.port) : 3306;
      const database = url.pathname ? url.pathname.slice(1) : '';
      
      if (!database) {
        throw new Error('Database name is required in DATABASE_URL');
      }

      // Create MySQL connection config for MariaDB adapter
      const poolConfig: PoolConfig = {
        host,
        port,
        user,
        password,
        database,
        connectionLimit: 10,
      };

      // Create Prisma adapter using MariaDB adapter
      const adapter = new PrismaMariaDb(poolConfig);
      clientOptions.adapter = adapter;
    } catch (error) {
      throw new Error(
        `Invalid DATABASE_URL format: ${error instanceof Error ? error.message : String(error)}. ` +
        'Expected format: mysql://user:password@host:port/database or mysql://user:password@host/database'
      );
    }
  }
  
  return new PrismaClient(clientOptions);
}

const prisma = createPrismaClient();

// Pool of Unsplash property image URLs
const propertyImageUrls = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1556911220-e15b29be4c89?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1556912173-6719e3e1daf4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
];

function getRandomUniqueImages(count: number = 4): string[] {
  const shuffled = [...propertyImageUrls].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function main() {
  console.log('🖼️  Starting image update for existing properties...');

  // Get all properties
  const properties = await prisma.property.findMany({
    select: { id: true },
  });

  console.log(`📝 Found ${properties.length} properties to update...`);

  // Update each property with 4 unique image URLs
  for (const property of properties) {
    const images = getRandomUniqueImages(4);
    
    await prisma.property.update({
      where: { id: property.id },
      data: { images: images },
    });
  }

  console.log(`✅ Successfully updated ${properties.length} properties with image URLs!`);
}

main()
  .catch((e) => {
    console.error('❌ Error updating images:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

