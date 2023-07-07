import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {
  }

  async signUp({ email, password: plainPassword }: CreateUserDto) {
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('User with this email already exists');
    }

    // hash password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(plainPassword, salt, 32)) as Buffer;
    const password = `${ salt }.${ hash.toString('hex') }`;

    // create and save user
    return this.usersService.create({ email, password });
  }

  async signIn({ email, password: plainPassword }: CreateUserDto) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(plainPassword, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Authentication failed');
    }

    return user;
  }
}
