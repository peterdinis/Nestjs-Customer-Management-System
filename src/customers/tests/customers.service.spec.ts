import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { Customer } from '@prisma/client';
import { CustomersService } from '../customers.service';

// Mock data representing a single customer
const mockCustomer: Customer = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
};

// Mock implementation of PrismaService methods related to customer operations
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

  // Setup before each test case
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService, // Specify the service to be tested
        { provide: PrismaService, useValue: mockPrismaService }, // Provide the mocked PrismaService
      ],
    }).compile();

    // Retrieve instances of the service and PrismaService from the module
    service = module.get<CustomersService>(CustomersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  /**
   * Test case: should be defined
   * @description Verifies that the `CustomersService` is defined and properly instantiated.
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    /**
     * Test case: should create a customer
     * @description Verifies that the `create` method of `CustomersService` creates a new customer and returns the created customer. It also ensures that the `create` method of `PrismaService` is called with the correct parameters.
     */
    it('should create a customer', async () => {
      const createCustomerDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
      };
      expect(await service.create(createCustomerDto)).toEqual(mockCustomer);
      expect(prismaService.customer.create).toHaveBeenCalledWith({
        data: createCustomerDto,
      });
    });
  });

  describe('findAll', () => {
    /**
     * Test case: should return an array of customers
     * @description Verifies that the `findAll` method of `CustomersService` returns an array of customers and that the `findMany` method of `PrismaService` is called.
     */
    it('should return an array of customers', async () => {
      expect(await service.findAll()).toEqual([mockCustomer]);
      expect(prismaService.customer.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    /**
     * Test case: should return a customer by ID
     * @description Verifies that the `findOne` method of `CustomersService` returns a customer by its ID and that the `findUnique` method of `PrismaService` is called with the correct ID.
     */
    it('should return a customer by ID', async () => {
      expect(await service.findOne(1)).toEqual(mockCustomer);
      expect(prismaService.customer.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    /**
     * Test case: should update a customer
     * @description Verifies that the `update` method of `CustomersService` updates an existing customer and returns the updated customer. It also ensures that the `update` method of `PrismaService` is called with the correct parameters.
     */
    it('should update a customer', async () => {
      const updateCustomerDto = {
        name: 'John Smith',
        email: 'john.smith@example.com',
      };
      expect(await service.update(1, updateCustomerDto)).toEqual(mockCustomer);
      expect(prismaService.customer.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateCustomerDto,
      });
    });
  });

  describe('remove', () => {
    /**
     * Test case: should delete a customer
     * @description Verifies that the `remove` method of `CustomersService` deletes a customer and returns the deleted customer. It also ensures that the `delete` method of `PrismaService` is called with the correct ID.
     */
    it('should delete a customer', async () => {
      expect(await service.remove(1)).toEqual(mockCustomer);
      expect(prismaService.customer.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});