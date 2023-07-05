import { Exclude, Expose } from 'class-transformer';
import { User } from '../users.entity';

export class UserDto extends User {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
