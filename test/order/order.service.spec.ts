import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../../src/order/order.service';
import { PrismaService } from '../../src/prisma/prisma.service';

const mockPrismaService = {
  order: { groupBy: jest.fn() },
  product: { findMany: jest.fn() },
};

describe('OrderService - Top Products', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return top 10 products for a valid region', async () => {
    const mockGroupBy = [
      { productId: 1, _count: { productId: 50 } },
      { productId: 2, _count: { productId: 30 } },
    ];
    const mockProducts = [
      { id: 1, name: 'Product1', price: 10 },
      { id: 2, name: 'Product2', price: 15 },
    ];

    mockPrismaService.order.groupBy.mockResolvedValue(mockGroupBy);
    mockPrismaService.product.findMany.mockResolvedValue(mockProducts);

    const result = await service.getTopProducts('RegionA');

    expect(mockPrismaService.order.groupBy).toHaveBeenCalledWith({
      by: ['productId'],
      _count: { productId: true },
      where: { region: 'RegionA' },
      orderBy: { _count: { productId: 'desc' } },
      take: 10,
    });

    expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
      where: { id: { in: [1, 2] } },
    });

    expect(result).toEqual([
      { id: 1, name: 'Product1', price: 10, orderCount: 50 },
      { id: 2, name: 'Product2', price: 15, orderCount: 30 },
    ]);
  });

  it('should return an empty array when no orders are found', async () => {
    mockPrismaService.order.groupBy.mockResolvedValue([]);
    mockPrismaService.product.findMany.mockResolvedValue([]);

    const result = await service.getTopProducts('RegionA');

    expect(result).toEqual([]);
  });

  it('should throw an error if region is not provided', async () => {
    await expect(service.getTopProducts(null)).rejects.toThrow('Region is required');
  });

  it('should handle invalid region gracefully', async () => {
    mockPrismaService.order.groupBy.mockResolvedValue([]);
    mockPrismaService.product.findMany.mockResolvedValue([]);

    const result = await service.getTopProducts('InvalidRegion');

    expect(result).toEqual([]);
  });
});
