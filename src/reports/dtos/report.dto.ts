import { Report } from '../reports.entity';
import { Expose, Transform } from 'class-transformer';

export class ReportDto implements Partial<Report> {
  @Expose()
  id: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  price: number;

  @Expose()
  mileage: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  approved: boolean;

  @Transform(({ obj: report }) => report.user.id)
  @Expose()
  userId: number;
}
