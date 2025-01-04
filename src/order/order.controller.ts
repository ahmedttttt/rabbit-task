import { Body, Controller, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/create-order-dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('top-products')
async getTopProducts(@Query('region') region: string) {
  if (!region) {
    throw new Error('Region is required');
  }
  return this.orderService.getTopProducts(region);
}

}
