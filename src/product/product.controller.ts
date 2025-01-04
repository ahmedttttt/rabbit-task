import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GetAllProductsDTO } from './dto/get-all-products.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  async getAllProducts(@Query() filters: GetAllProductsDTO) {
    const { page = 1, pageSize = 10, ...otherFilters } = filters;

    // Pass pagination and filters to the service
    return this.productsService.getAllProducts({
      page: Number(page),
      pageSize: Number(pageSize),
      filters: otherFilters,
    });
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(Number(id));
  }
}
