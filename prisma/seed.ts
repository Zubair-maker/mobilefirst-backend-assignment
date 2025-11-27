import { PrismaClient, Prisma } from '@prisma/client';
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

// Sample data arrays for random generation
const buildingNames = [
  'The Central Downtown Tower C',
  'Binghatti Starlight',
  'The First Collection',
  'Dubai Marina Tower',
  'Burj Khalifa Residences',
  'Palm Jumeirah Villa',
  'Downtown Dubai Apartments',
  'Business Bay Tower',
  'Jumeirah Beach Residences',
  'Dubai Hills Estate',
  'Arabian Ranches Villa',
  'Emirates Hills Mansion',
  'Dubai Creek Harbour',
  'Dubai Sports City',
  'Dubai Silicon Oasis',
];

const communities = [
  'The Central',
  'Downtown Dubai',
  'Dubai Marina',
  'Business Bay',
  'Jumeirah',
  'Palm Jumeirah',
  'Dubai Hills',
  'Arabian Ranches',
  'Emirates Hills',
  'Dubai Creek Harbour',
];

const propertyTypes = ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Studio'];
const purposes = ['For Sale', 'For Rent'];
const completionStatuses = ['Ready', 'Off-Plan'];
const furnishingOptions = ['Furnished', 'Unfurnished', 'Semi-Furnished'];
const ownershipTypes = ['Freehold', 'Leasehold'];
const usageTypes = ['Residential', 'Commercial', 'Mixed Use'];
const developers = [
  'DUBAI CREEK HARBOUR',
  'EMAAR Properties',
  'Nakheel',
  'Dubai Properties',
  'Damac Properties',
  'Sobha Realty',
  'Mercedes-Benz Places',
  'Binghatti Developers',
];

const handoverQuarters = ['Q1 2028', 'Q2 2028', 'Q3 2028', 'Q4 2028', 'Q1 2029', 'Q2 2029'];

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

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomUniqueImages(count: number = 4): string[] {
  const shuffled = [...propertyImageUrls].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDecimal(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function generateReferenceNo(index: number): string {
  return `Bayut-${String(index).padStart(6, '0')}-${Math.random().toString(36).substring(2, 8)}`;
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log('🌱 Starting seed...');

  const properties: Prisma.PropertyCreateInput[] = [];

  for (let i = 1; i <= 50; i++) {
    const buildingName = getRandomElement(buildingNames);
    const community = getRandomElement(communities);
    const propertyType = getRandomElement(propertyTypes);
    const purpose = getRandomElement(purposes);
    const bedrooms = getRandomInt(1, 5);
    const bathrooms = getRandomInt(1, 4);
    const size = getRandomInt(500, 3000);
    const price = purpose === 'For Sale' 
      ? getRandomDecimal(1000000, 10000000) 
      : getRandomDecimal(50000, 500000);
    
    const totalBuildingArea = Math.random() > 0.3 
      ? getRandomDecimal(500000, 2000000) 
      : null;

    const property = {
      title: `${buildingName}${i > buildingNames.length ? ` ${Math.floor(i / buildingNames.length) + 1}` : ''}`,
      location: `${buildingName}, ${community}, Dubai`,
      price: new Prisma.Decimal(price),
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      size: size,
      description: `Luxury ${propertyType.toLowerCase()} in the heart of ${community}.`,
      community: community,
      balcony: Math.random() > 0.3, // 70% have balcony
      type: propertyType,
      purpose: purpose,
      referenceNo: generateReferenceNo(i),
      completion: getRandomElement(completionStatuses),
      furnishing: getRandomElement(furnishingOptions),
      addedOn: getRandomDate(new Date(2024, 0, 1), new Date()),
      handoverDate: Math.random() > 0.5 ? getRandomElement(handoverQuarters) : null,
      developer: Math.random() > 0.3 ? getRandomElement(developers) : null,
      ownership: Math.random() > 0.2 ? getRandomElement(ownershipTypes) : null,
      builtUpArea: size + getRandomInt(-50, 100),
      usage: getRandomElement(usageTypes),
      balconySize: Math.random() > 0.3 ? getRandomInt(50, 200) : null,
      parkingAvailability: Math.random() > 0.2, // 80% have parking
      buildingName: buildingName,
      totalFloors: Math.random() > 0.3 ? getRandomInt(10, 80) : null,
      swimmingPools: Math.random() > 0.4 ? getRandomInt(1, 3) : null,
      totalParkingSpaces: Math.random() > 0.3 ? getRandomInt(50, 1000) : null,
      totalBuildingArea: totalBuildingArea ? new Prisma.Decimal(totalBuildingArea) : null,
      elevators: Math.random() > 0.4 ? getRandomInt(2, 12) : null,
      images: getRandomUniqueImages(4), // 4 unique image URLs
    };

    properties.push(property);
  }

  console.log(`📝 Creating ${properties.length} properties...`);

  // Use createMany for better performance
  await prisma.property.createMany({
    data: properties,
    skipDuplicates: true,
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

