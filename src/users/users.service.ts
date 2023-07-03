import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {
  }

  create(user: CreateUserDto) {
    const newUser = this.repo.create(user);

    return this.repo.save(newUser);
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, userData: Partial<User>) {
    const existingUser = await this.repo.findOne({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException('User with this id does not exist');
    }

    const updatedUser = this.repo.create({ ...existingUser, ...userData });
    return this.repo.save(updatedUser);
  }

  async remove(id: number) {
    const existingUser = await this.repo.findOne({ where: { id } });

    if (!existingUser) {
      throw new NotFoundException('User with this id does not exist');
    }

    return this.repo.remove(existingUser);
  }
}
