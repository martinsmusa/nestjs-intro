import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

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

  async getEstimate(
    { make, model, lng, lat, year, mileage }: GetEstimateDto
  ) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .setParameters({ mileage })
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .groupBy('mileage')
      .orderBy('mileage - :mileage', 'DESC')
      .limit(3)
      .getRawOne();
  }
}
