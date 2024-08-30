import { Test, TestingModule } from '@nestjs/testing';
import { Customer } from '@prisma/client';
import { CustomersController } from '../customers.controller';
import { CustomersService } from '../customers.service';
import { CreateCustomerDto } from '../dto/create-customer-dto';
import { UpdateCustomerDto } from '../dto/update-customer-dto';

const mockCustomer: Customer = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
};

const mockCustomersService = {
  create: jest.fn().mockResolvedValue(mockCustomer),
  findAll: jest.fn().mockResolvedValue([mockCustomer]),
  findOne: jest.fn().mockResolvedValue(mockCustomer),
  update: jest.fn().mockResolvedValue(mockCustomer),
  remove: jest.fn().mockResolvedValue(mockCustomer),
};

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        { provide: CustomersService, useValue: mockCustomersService },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
      };
      expect(await controller.create(createCustomerDto)).toEqual(mockCustomer);
      expect(service.create).toHaveBeenCalledWith(createCustomerDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      expect(await controller.findAll()).toEqual([mockCustomer]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a customer by ID', async () => {
      expect(await controller.findOne(1)).toEqual(mockCustomer);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const updateCustomerDto: UpdateCustomerDto = {
        name: 'John Smith',
        email: 'john.smith@example.com',
      };
      expect(await controller.update(1, updateCustomerDto)).toEqual(
        mockCustomer,
      );
      expect(service.update).toHaveBeenCalledWith(1, updateCustomerDto);
    });
  });

  describe('remove', () => {
    it('should delete a customer', async () => {
      expect(await controller.remove(1)).toEqual(mockCustomer);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
