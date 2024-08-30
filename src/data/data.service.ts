import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { CustomerType } from 'src/types/CustomerType';
import { validateDtoFields } from 'src/utils/dto-check';
@Injectable()
export class DataService {
  private customers: CustomerType[] = [];
  private counter = 1;

  constructor() {
    this.generateRandomCustomers(10);
  }

  private generateRandomCustomers(count: number): void {
    for (let i = 0; i < count; i++) {
      const newCustomer: Omit<CustomerType, 'id'> = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
      };
      this.create(newCustomer);
    }
  }

  findAll(): CustomerType[] {
    return this.customers;
  }

  findOne(id: number): CustomerType {
    const customer = this.customers.find(
      (customer) => customer.id === Number(id),
    );
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found.`);
    }
    return customer;
  }

  create(customerData: Omit<CustomerType, 'id'>): CustomerType {
    // Validate that only allowed fields are present in customerData
    validateDtoFields(customerData, ['name', 'email']);

    if (!customerData.name || !customerData.email) {
      throw new BadRequestException('Invalid customer data.');
    }

    const newCustomer = { id: this.counter++, ...customerData };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  update(
    id: number,
    customerData: Partial<Omit<CustomerType, 'id'>>,
  ): CustomerType {
    // Validate that only allowed fields are present in customerData
    validateDtoFields(customerData, ['name', 'email']);

    const customer = this.findOne(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found.`);
    }

    // Updating fields
    if (customerData.name !== undefined) {
      customer.name = customerData.name;
    }
    if (customerData.email !== undefined) {
      customer.email = customerData.email;
    }

    return customer;
  }
}
