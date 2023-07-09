import { Report } from '../reports.entity';
import { IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReportDto implements Partial<Report> {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsNumber()
  @Min(0)
  @Max(1e6)
  price: number;

  @IsNumber()
  @Min(0)
  @Max(16e5)
  mileage: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;
}
