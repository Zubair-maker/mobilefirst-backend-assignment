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

    // Type filter (Residential filter)
    if (type) {
      where.type = type;
    }

    // Bedrooms filter
    if (bedrooms !== undefined) {
      where.bedrooms = bedrooms;
    }

    // Bathrooms filter
    if (bathrooms !== undefined) {
      where.bathrooms = bathrooms;
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

