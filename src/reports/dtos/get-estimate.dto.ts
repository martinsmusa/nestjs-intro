import { Report } from '../reports.entity';
import { IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimateDto implements Partial<Report> {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(16e5)
  mileage: number;

  @IsLongitude()
  lng: string;

  @IsLatitude()
  lat: string;
}
