import { Controller, Get, Post, Body, UseGuards, Inject } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { NATS_SERVICE } from 'src/config/service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { User } from './decorators/user.decorator';
import { Token } from './decorators/token.decorator';
import { User as InterfaceUser } from './entities/auth.entity';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = await firstValueFrom(
        this.client.send('auth.register', registerDto),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('login')
  async create(@Body() loginDto: LoginDto) {
    try {
      const user = await firstValueFrom(
        this.client.send('auth.login', loginDto),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  //obtener todos los usuarios
  @Get('findAll')
  async findAll() {
    try {
      const users = await firstValueFrom(this.client.send('auth.findAll', {}));
      return users;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verify(@User() user: InterfaceUser, @Token() token: string) {
    return { user, token };
  }
}
