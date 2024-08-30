import { Test, TestingModule } from '@nestjs/testing';
import { DataService} from 'src/data/data.service';
import { AppController } from '../app.controller';
import { CustomerType } from 'src/types/CustomerType';

describe('AppController', () => {
  let appController: AppController;
  let dataService: DataService;

  const mockCustomers: CustomerType[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
  ];

  const mockDataService = {
    findAll: jest.fn().mockReturnValue(mockCustomers),
    findOne: jest.fn().mockImplementation((id: number) => mockCustomers.find(c => c.id === id)),
    create: jest.fn().mockImplementation((customerData: Omit<CustomerType, 'id'>) => ({
      id: 3,
      ...customerData,
    })),
    update: jest.fn().mockImplementation((id: number, customerData: Partial<Omit<CustomerType, 'id'>>) => {
      const customer = mockCustomers.find(c => c.id === id);
      if (customer) {
        Object.assign(customer, customerData);
        return customer;
      }
      return undefined;
    }),
  };

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

    appController = module.get<AppController>(AppController);
    dataService = module.get<DataService>(DataService);
  });

  it('should return all customers', () => {
    expect(appController.allCustomers()).toEqual(mockCustomers);
    expect(dataService.findAll).toHaveBeenCalled();
  });

  it('should return one customer by ID', () => {
    const customer = appController.findOne(1);
    expect(customer).toEqual(mockCustomers[0]);
    expect(dataService.findOne).toHaveBeenCalledWith(1);
  });

  it('should create a new customer', () => {
    const newCustomer = { name: 'Alice', email: 'alice@example.com' };
    const createdCustomer = appController.create(newCustomer);
    expect(createdCustomer).toEqual({ id: 3, ...newCustomer });
    expect(dataService.create).toHaveBeenCalledWith(newCustomer);
  });

  it('should update an existing customer', () => {
    const updatedData = { name: 'John Updated' };
    const updatedCustomer = appController.update(1, updatedData);
    expect(updatedCustomer).toEqual({ id: 1, name: 'John Updated', email: 'john.doe@example.com' });
    expect(dataService.update).toHaveBeenCalledWith(1, updatedData);
  });
});