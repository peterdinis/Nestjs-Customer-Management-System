import { Test, TestingModule } from '@nestjs/testing';
import { DataService } from 'src/data/data.service';
import { AppController } from '../app.controller';
import { CustomerType } from 'src/types/CustomerType';

describe('AppController', () => {
  let appController: AppController;
  let dataService: DataService;

  // Mock data to simulate customer records
  const mockCustomers: CustomerType[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
  ];

  // Mock implementation of DataService methods
  const mockDataService = {
    findAll: jest.fn().mockReturnValue(mockCustomers),
    findOne: jest
      .fn()
      .mockImplementation((id: number) =>
        mockCustomers.find((c) => c.id === id),
      ),
    create: jest
      .fn()
      .mockImplementation((customerData: Omit<CustomerType, 'id'>) => ({
        id: 3,
        ...customerData,
      })),
    update: jest
      .fn()
      .mockImplementation(
        (id: number, customerData: Partial<Omit<CustomerType, 'id'>>) => {
          const customer = mockCustomers.find((c) => c.id === id);
          if (customer) {
            Object.assign(customer, customerData);
            return customer;
          }
          return undefined;
        },
      ),
  };

  // Setup before each test case
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: DataService,
          useValue: mockDataService,
        },
      ],
    }).compile();

    // Get instances of AppController and DataService
    appController = module.get<AppController>(AppController);
    dataService = module.get<DataService>(DataService);
  });

  /**
   * Test case: should return all customers
   * @description Verifies that the `allCustomers` method of `AppController` returns all customer records and that `findAll` of `DataService` is called.
   */
  it('should return all customers', () => {
    // Call the method and verify the result
    expect(appController.allCustomers()).toEqual(mockCustomers);
    // Verify that findAll was called
    expect(dataService.findAll).toHaveBeenCalled();
  });

  /**
   * Test case: should return one customer by ID
   * @description Verifies that the `findOne` method of `AppController` returns a single customer record by ID and that `findOne` of `DataService` is called with the correct ID.
   */
  it('should return one customer by ID', () => {
    // Call the method and verify the result
    const customer = appController.findOne(1);
    expect(customer).toEqual(mockCustomers[0]);
    // Verify that findOne was called with the correct ID
    expect(dataService.findOne).toHaveBeenCalledWith(1);
  });

  /**
   * Test case: should create a new customer
   * @description Verifies that the `create` method of `AppController` correctly creates a new customer and that `create` of `DataService` is called with the correct data.
   */
  it('should create a new customer', () => {
    // Define new customer data
    const newCustomer = { name: 'Alice', email: 'alice@example.com' };
    // Call the method and verify the result
    const createdCustomer = appController.create(newCustomer);
    expect(createdCustomer).toEqual({ id: 3, ...newCustomer });
    // Verify that create was called with the correct data
    expect(dataService.create).toHaveBeenCalledWith(newCustomer);
  });

  /**
   * Test case: should update an existing customer
   * @description Verifies that the `update` method of `AppController` correctly updates an existing customer and that `update` of `DataService` is called with the correct ID and data.
   */
  it('should update an existing customer', () => {
    // Define updated customer data
    const updatedData = { name: 'John Updated' };
    // Call the method and verify the result
    const updatedCustomer = appController.update(1, updatedData);
    expect(updatedCustomer).toEqual({
      id: 1,
      name: 'John Updated',
      email: 'john.doe@example.com',
    });
    // Verify that update was called with the correct ID and data
    expect(dataService.update).toHaveBeenCalledWith(1, updatedData);
  });
});
