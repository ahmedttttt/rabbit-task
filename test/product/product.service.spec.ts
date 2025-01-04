import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../../src/product/product.service';
import { PrismaService } from '../../src/prisma/prisma.service';

const mockPrismaService = {
  product: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
};

describe('ProductService - Get All Products', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return paginated products with valid input', async () => {
    const mockProducts = [
      { id: 1, name: 'Product1', price: 10 },
      { id: 2, name: 'Product2', price: 20 },
    ];
    const totalProducts = 15;

    mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
    mockPrismaService.product.count.mockResolvedValue(totalProducts);

    const result = await service.getAllProducts({
      page: 1,
      pageSize: 10,
      filters: {},
    });

    expect(result).toEqual({
      data: mockProducts,
      totalProducts,
      currentPage: 1,
      totalPages: 2,
    });
  });

  it('should handle filters correctly', async () => {
    const mockProducts = [{ id: 1, name: 'FilteredProduct', price: 15 }];
    const totalProducts = 1;

    mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
    mockPrismaService.product.count.mockResolvedValue(totalProducts);

    const result = await service.getAllProducts({
      page: 1,
      pageSize: 10,
      filters: { category: 'Electronics' },
    });

    expect(result).toEqual({
      data: mockProducts,
      totalProducts,
      currentPage: 1,
      totalPages: 1,
    });
  });

  it('should return an empty array for no matching products', async () => {
    mockPrismaService.product.findMany.mockResolvedValue([]);
    mockPrismaService.product.count.mockResolvedValue(0);

    const result = await service.getAllProducts({
      page: 1,
      pageSize: 10,
      filters: {},
    });

    expect(result).toEqual({
      data: [],
      totalProducts: 0,
      currentPage: 1,
      totalPages: 0,
    });
  });

  it('should calculate pagination correctly', async () => {
    mockPrismaService.product.findMany.mockResolvedValue([]);
    mockPrismaService.product.count.mockResolvedValue(25);

    const result = await service.getAllProducts({
      page: 3,
      pageSize: 10,
      filters: {},
    });

    expect(result).toEqual({
      data: [],
      totalProducts: 25,
      currentPage: 3,
      totalPages: 3,
    });
  });
});
