import {
  Body,
  Controller,
  Delete,
  Get, NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session, UseGuards
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './users.entity';
import { AuthGuard } from '../guards/auth.guard';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(
    @CurrentUser() currentUser: User
  ) {
    return currentUser;
  }

  @Post('/signup')
  async createUser(
    @Body() body: CreateUserDto,
    @Session() session: any
  ) {
    const user = await this.authService.signUp(body);
    session.userId = user.id;
    return user;
  }

  @Post('/signIn')
  async signIn(
    @Body() body: CreateUserDto,
    @Session() session: any
  ) {
    const user = await this.authService.signIn(body);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signOut(
    @Session() session: any
  ) {
    session.userId = null;
  }

  @Get('/:id')
  async findUser(
    @Param('id') id: string
  ) {
    const user = await this.usersService.findOne(parseInt(id));

    console.log(user);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  @Get()
  findAllUsers(
    @Query('email') email: string
  ) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(
    @Param('id') id: string ,
    @Body() data: UpdateUserDto
  ) {
    return this.usersService.update(parseInt(id), data);
  }
}
