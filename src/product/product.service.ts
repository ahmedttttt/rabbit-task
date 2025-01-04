import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAllProductsDTO } from './dto/get-all-products.dto';
import { ProductDTO } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllProducts({
    page,
    pageSize,
    filters,
  }: {
    page: number;
    pageSize: number;
    filters: any;
  }) {
    const skip = (page - 1) * pageSize;

    const products = await this.prismaService.product.findMany({
      skip,
      take: pageSize,
      where: {
        ...filters, 
      },
      orderBy: {
        name: 'asc', 
      },
    });

    const totalProducts = await this.prismaService.product.count({
      where: {
        ...filters,
      },
    });

    return {
      data: products,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / pageSize),
    };
  }

  async getProductById(id: number) {
    return this.prismaService.product.findUnique({
      where: { id },
    });
  }
}
