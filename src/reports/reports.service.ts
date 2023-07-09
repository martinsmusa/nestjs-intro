import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)private repo: Repository<Report>
  ) {
  }

  async create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create({ ...reportDto, user });
    return this.repo.save(report);
  }

  async changeApprovalStatus(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where:{ id: +id } });

    if (!report) {
      throw new NotFoundException('Report does not exist');
    }

    return this.repo.save({
      ...report,
      approved
    });
  }
}
