import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne(id: number): null | Promise<User> {
        return Promise.resolve({
          id,
          email: 'a@b.c',
          password: 'pass'
        } as User);
      },
      find(email: string): Promise<User[]> {
        return Promise.resolve([{
          id: Math.floor(Math.random() * 9999),
          email,
          password: 'pass'
        } as User]);
      },
    };
    fakeAuthService = {
      async signIn({ email, password }: CreateUserDto): Promise<User> {
        return Promise.resolve({
          id: 1, email, password
        } as User);
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns all users with the given email', async () => {
    const email = 'a@b.c';
    const users = await controller.findAllUsers(email);

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual(email);
  });

  it('findUser returns user with the given id', async () => {
    const user = await controller.findUser('1');
    await expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;

    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('sets user id in session and return user on successful signIn', async () => {
    const signInData = { email: 'test@test.com', password: 'qwerty' };
    const session = { userId: 0 };
    const user = await controller.signIn(signInData, session);

    expect(session.userId).toEqual(1);
    expect(user.id).toEqual(1);
  });
});
