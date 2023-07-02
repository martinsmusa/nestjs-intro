import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entity } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Entity])],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
