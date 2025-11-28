import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilterPropertiesDto, PurposeFilter, CompletionFilter } from './dto/filter-properties.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: FilterPropertiesDto) {
    const {
      purpose,
      completion,
      type,
      bedrooms,
      bathrooms,
      minPrice,
      maxPrice,
      location,
      page = 1,
      limit = 10,
    } = filters;

    // Build where clause for filtering
    const where: Prisma.PropertyWhereInput = {};

    // Purpose filter: Buy -> "For Sale", Rent -> "For Rent"
    if (purpose) {
      if (purpose === PurposeFilter.BUY) {
        where.purpose = 'For Sale';
      } else if (purpose === PurposeFilter.RENT) {
        where.purpose = 'For Rent';
      }
    }

    // Completion filter: All -> no filter, Ready -> "Ready", Off-Plan -> "Off-Plan"
    if (completion && completion !== CompletionFilter.ALL) {
      if (completion === CompletionFilter.READY) {
        where.completion = 'Ready';
      } else if (completion === CompletionFilter.OFF_PLAN) {
        where.completion = 'Off-Plan';
      }
    }

    // Type filter (Residential filter) - supports multiple types
    if (type && type.length > 0) {
      where.type = { in: type }; // Prisma 'in' operator for array of types
    }

    // Bedrooms filter - supports multiple values and "Studio" (converted to 0)
    if (bedrooms && bedrooms.length > 0) {
      const bedroomValues = bedrooms.map((b) => {
        if (typeof b === 'string' && b.toLowerCase() === 'studio') {
          return 0; // Convert "Studio" to 0
        }
        return Number(b);
      });
      where.bedrooms = { in: bedroomValues }; // Prisma 'in' operator for array
    }

    // Bathrooms filter - supports multiple values
    if (bathrooms && bathrooms.length > 0) {
      where.bathrooms = { in: bathrooms }; // Prisma 'in' operator for array
    }

    // Price filter (min and max)
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = new Prisma.Decimal(minPrice);
      }
      if (maxPrice !== undefined) {
        where.price.lte = new Prisma.Decimal(maxPrice);
      }
    }

    // Location filter (partial match - MySQL handles case-insensitive by default with utf8mb4_unicode_ci)
    if (location) {
      where.location = {
        contains: location,
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const total = await this.prisma.property.count({ where });

    // Get paginated results
    const properties = await this.prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc', // Order by newest first
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: properties,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async findOne(id: number) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }
}

