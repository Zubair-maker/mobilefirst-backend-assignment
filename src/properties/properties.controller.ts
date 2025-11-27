import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { FilterPropertiesDto } from './dto/filter-properties.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  findAll(@Body() filterDto: FilterPropertiesDto) {
    return this.propertiesService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.propertiesService.findOne(id);
  }
}

