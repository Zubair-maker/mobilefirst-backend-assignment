import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  IsNumber,
  IsArray,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PurposeFilter {
  BUY = 'Buy',
  RENT = 'Rent',
}

export enum CompletionFilter {
  ALL = 'All',
  READY = 'Ready',
  OFF_PLAN = 'Off-Plan',
}

export class FilterPropertiesDto {
  @IsOptional()
  @IsEnum(PurposeFilter)
  purpose?: PurposeFilter; // Buy or Rent -> maps to "For Sale" or "For Rent"

  @IsOptional()
  @IsEnum(CompletionFilter)
  completion?: CompletionFilter; // All, Ready, or Off-Plan

  @IsOptional()
  @IsString()
  type?: string; // Residential filter -> Apartment, Villa, Townhouse, etc.

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  bedrooms?: number; // Beds filter

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  bathrooms?: number; // Baths filter

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number; // Minimum price

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ValidateIf((o) => o.minPrice !== undefined || o.maxPrice !== undefined)
  maxPrice?: number; // Maximum price

  @IsOptional()
  @IsString()
  location?: string; // Location filter

  // Pagination
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1; // Default to page 1

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10; // Default to 10 items per page
}

