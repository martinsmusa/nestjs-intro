import { Body, Controller, Get, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/users.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(
    private reportsService: ReportsService
  ) {
  }

  @Post('/create')
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  async createReport(
    @Body() body: CreateReportDto,
    @CurrentUser() user: User
  ) {
    return this.reportsService.create(body, user);
  }

  @UseGuards(AdminGuard)
  @Patch('/:id')
  approveReport(
    @Param('id') id: string,
    @Body() body: ApproveReportDto
  ) {
    return this.reportsService.changeApprovalStatus(id, body.approved);
  }

  @Get()
  getEstimate(
    @Query() query: GetEstimateDto
  ) {
    return query;
  }
}
