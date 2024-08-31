import { Test, TestingModule } from '@nestjs/testing';
import { Customer } from '@prisma/client';
import { CustomersController } from '../customers.controller';
import { CustomersService } from '../customers.service';
import { CreateCustomerDto } from '../dto/create-customer-dto';
import { UpdateCustomerDto } from '../dto/update-customer-dto';

// Mock data representing a single customer
const mockCustomer: Customer = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
};

// Mock implementation of CustomersService methods
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

  // Setup before each test case
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController], // Specify the controller to be tested
      providers: [
        { provide: CustomersService, useValue: mockCustomersService }, // Provide the mocked service
      ],
    }).compile();

    // Retrieve instances of the controller and service from the module
    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
  });

  /**
   * Test case: should be defined
   * @description Verifies that the `CustomersController` is defined and instantiated correctly.
   */
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    /**
     * Test case: should create a customer
     * @description Verifies that the `create` method of `CustomersController` creates a new customer using the `CustomersService` and returns the created customer.
     */
    it('should create a customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
      };
      expect(await controller.create(createCustomerDto)).toEqual(mockCustomer);
      expect(service.create).toHaveBeenCalledWith(createCustomerDto);
    });

    /**
     * Test case: should handle failure when creating a customer
     * @description Verifies that the `create` method of `CustomersController` handles errors when customer creation fails.
     */
    it('should handle failure when creating a customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'John Doe',
        email: 'john.doe@example.com',
      };
      (service.create as jest.Mock).mockRejectedValueOnce(new Error('Creation failed'));

      try {
        await controller.create(createCustomerDto);
      } catch (error) {
        expect(error.message).toBe('Creation failed');
      }
    });
  });

  describe('findAll', () => {
    /**
     * Test case: should return an array of customers
     * @description Verifies that the `findAll` method of `CustomersController` returns an array of customers and that `CustomersService`'s `findAll` method is called.
     */
    it('should return an array of customers', async () => {
      expect(await controller.findAll()).toEqual([mockCustomer]);
      expect(service.findAll).toHaveBeenCalled();
    });

    /**
     * Test case: should handle failure when finding all customers
     * @description Verifies that the `findAll` method of `CustomersController` handles errors when retrieving customers fails.
     */
    it('should handle failure when finding all customers', async () => {
      (service.findAll as jest.Mock).mockRejectedValueOnce(new Error('Find all failed'));

      try {
        await controller.findAll();
      } catch (error) {
        expect(error.message).toBe('Find all failed');
      }
    });
  });

  describe('findOne', () => {
    /**
     * Test case: should return a customer by ID
     * @description Verifies that the `findOne` method of `CustomersController` returns a customer by ID and that `CustomersService`'s `findOne` method is called with the correct ID.
     */
    it('should return a customer by ID', async () => {
      expect(await controller.findOne(1)).toEqual(mockCustomer);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    /**
     * Test case: should handle case where customer does not exist
     * @description Verifies that the `findOne` method of `CustomersController` handles cases where the requested customer ID does not exist.
     */
    it('should handle case where customer does not exist', async () => {
      (service.findOne as jest.Mock).mockResolvedValueOnce(null);

      const customer = await controller.findOne(999);
      expect(customer).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith(999);
    });

    /**
     * Test case: should handle failure when finding a customer by ID
     * @description Verifies that the `findOne` method of `CustomersController` handles errors when retrieving a customer by ID fails.
     */
    it('should handle failure when finding a customer by ID', async () => {
      (service.findOne as jest.Mock).mockRejectedValueOnce(new Error('Find one failed'));

      try {
        await controller.findOne(1);
      } catch (error) {
        expect(error.message).toBe('Find one failed');
      }
    });
  });

  describe('update', () => {
    /**
     * Test case: should update a customer
     * @description Verifies that the `update` method of `CustomersController` updates an existing customer and returns the updated customer. It also checks that `CustomersService`'s `update` method is called with the correct parameters.
     */
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

    /**
     * Test case: should handle failure when updating a customer
     * @description Verifies that the `update` method of `CustomersController` handles errors when updating a customer fails.
     */
    it('should handle failure when updating a customer', async () => {
      const updateCustomerDto: UpdateCustomerDto = {
        name: 'John Smith',
        email: 'john.smith@example.com',
      };
      (service.update as jest.Mock).mockRejectedValueOnce(new Error('Update failed'));

      try {
        await controller.update(1, updateCustomerDto);
      } catch (error) {
        expect(error.message).toBe('Update failed');
      }
    });
  });

  describe('remove', () => {
    /**
     * Test case: should delete a customer
     * @description Verifies that the `remove` method of `CustomersController` deletes a customer and returns the deleted customer. It also checks that `CustomersService`'s `remove` method is called with the correct ID.
     */
    it('should delete a customer', async () => {
      expect(await controller.remove(1)).toEqual(mockCustomer);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    /**
     * Test case: should handle failure when deleting a customer
     * @description Verifies that the `remove` method of `CustomersController` handles errors when deleting a customer fails.
     */
    it('should handle failure when deleting a customer', async () => {
      (service.remove as jest.Mock).mockRejectedValueOnce(new Error('Remove failed'));

      try {
        await controller.remove(1);
      } catch (error) {
        expect(error.message).toBe('Remove failed');
      }
    });
  });
});