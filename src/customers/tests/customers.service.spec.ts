import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { Customer } from '@prisma/client';
import { CustomersService } from '../customers.service';

const mockCustomer: Customer = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
};

const mockPrismaService = {
  customer: {
    create: jest.fn().mockResolvedValue(mockCustomer),
    findMany: jest.fn().mockResolvedValue([mockCustomer]),
    findUnique: jest.fn().mockResolvedValue(mockCustomer),
    update: jest.fn().mockResolvedValue(mockCustomer),
    delete: jest.fn().mockResolvedValue(mockCustomer),
  },
};

describe('CustomersService', () => {
  let service: CustomersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const createCustomerDto = { name: 'John Doe', email: 'john.doe@example.com' };
      expect(await service.create(createCustomerDto)).toEqual(mockCustomer);
      expect(prismaService.customer.create).toHaveBeenCalledWith({
        data: createCustomerDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      expect(await service.findAll()).toEqual([mockCustomer]);
      expect(prismaService.customer.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a customer by ID', async () => {
      expect(await service.findOne(1)).toEqual(mockCustomer);
      expect(prismaService.customer.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const updateCustomerDto = { name: 'John Smith', email: 'john.smith@example.com' };
      expect(await service.update(1, updateCustomerDto)).toEqual(mockCustomer);
      expect(prismaService.customer.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateCustomerDto,
      });
    });
  });

  describe('remove', () => {
    it('should delete a customer', async () => {
      expect(await service.remove(1)).toEqual(mockCustomer);
      expect(prismaService.customer.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});