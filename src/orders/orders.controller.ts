import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config/service';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { firstValueFrom } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await firstValueFrom(
        this.client.send('orders.create', createOrderDto),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Post('createProduct')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      const order = await firstValueFrom(
        this.client.send('create.product', createProductDto),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('products')
  async getAllProducts() {
    try {
      const products = await firstValueFrom(
        this.client.send('get.all.products', {}),
      );
      return products;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  async getOrdersByUser(@Param('userId') userId: string) {
    try {
      const orders = await firstValueFrom(
        this.client.send('get.orders.by.user', userId),
      );
      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':orderId/status')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body('status')
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED',
  ) {
    try {
      const updatedOrder = await firstValueFrom(
        this.client.send('update.order.status', { orderId, status }),
      );
      return updatedOrder;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
