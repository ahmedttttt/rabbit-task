import { Injectable } from '@nestjs/common';
import { CreateOrderDTO } from './dto/create-order-dto';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async getTopProducts(region: string) {
    const result = await this.prismaService.order.groupBy({
      by: ['productId'],
      _count: { productId: true },
      where: {
        region: region,
      },
      orderBy: {
        _count: {
          productId: 'desc',
        },
      },
      take: 10,
    });

    const productDetails = await this.prismaService.product.findMany({
      where: {
        id: { in: result.map((r) => r.productId) },
      },
    });

    return productDetails.map((product) => {
      const count = result.find((r) => r.productId === product.id)?._count?.productId;
      return { ...product, orderCount: count };
    });
  }
}
