import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  IsNumber,
  IsArray,
  ValidateIf,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
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

@ValidatorConstraint({ name: 'isBedroomValue', async: false })
export class IsBedroomValueConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value === 'number') {
      return Number.isInteger(value) && value >= 0;
    }
    if (typeof value === 'string') {
      return value.toLowerCase() === 'studio';
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Each bedroom value must be a non-negative integer or "Studio"';
  }
}

export class FilterPropertiesDto {
  @IsOptional()
  @IsEnum(PurposeFilter)
  purpose?: PurposeFilter; // Buy or Rent -> maps to "For Sale" or "For Rent"

  @IsOptional()
  @IsEnum(CompletionFilter)
  completion?: CompletionFilter; // All, Ready, or Off-Plan

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  type?: string[]; // Residential filter -> Apartment, Villa, Townhouse, etc. (supports multiple types)

  @IsOptional()
  @IsArray()
  @Validate(IsBedroomValueConstraint, { each: true })
  bedrooms?: (number | string)[]; // Beds filter - supports multiple values and "Studio" (converted to 0)

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  bathrooms?: number[]; // Baths filter - supports multiple values

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

