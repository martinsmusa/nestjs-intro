import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      find: (email): Promise<User[]> => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (userData: CreateUserDto): Promise<User> => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          ...userData,
          created_at: new Date(),
          updated_at: new Date()
        } as User;

        users.push(user);

        return Promise.resolve(user);
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const createUserData = { email: 'test@test.com', password: 'qwerty' };
    const user = await service.signUp(createUserData);

    expect(user.password).not.toEqual(createUserData.password);

    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    const createUserData = { email: 'test@test.com', password: 'qwerty' };

    await service.signUp(createUserData);
    await expect(service.signUp(createUserData)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    const createUserData = { email: 'test@test.com', password: 'qwerty' };

    await expect(
      service.signIn(createUserData),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    const createUserData = { email: 'test@test.com', password: 'qwerty' } as User;

    await service.signUp({ email: createUserData.email, password: 'qwerty123*' });
    await expect(
      service.signIn(createUserData),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns user if correct password is passed', async () => {
    const createUserData = { email: 'test@test.com', password: 'qwerty' } as User;
    await service.signUp(createUserData);
    const user = await service.signIn(createUserData);

    expect(user).toBeDefined();
  });
});
