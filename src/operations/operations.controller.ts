import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { ApiBearerAuth } from '@nestjs/swagger';

import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { OperationsService } from './operations.service';
import { CreateOperationDto } from './dto/create-operation.dto';

@Controller('operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Get()
  findAll() {
    return this.operationsService.findAll();
  }

  @Post('income')
  @Roles('ADMIN', 'ACCOUNTANT')
  createIncome(@Body() data: CreateOperationDto, @Req() req: Request) {
    return this.operationsService.create(data, req.user!.id, 'INCOME');
  }

  @Post('outcome')
  @Roles('ADMIN', 'WAREHOUSE')
  createOutcome(@Body() data: CreateOperationDto, @Req() req: Request) {
    return this.operationsService.create(data, req.user!.id, 'OUTCOME');
  }
}
