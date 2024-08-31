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
  private customers: CustomerType[] = []; // Array to hold customer data
  private counter = 1; // Counter to assign unique IDs to new customers

  constructor() {
    // Generate an initial list of random customers when the service is instantiated
    this.generateRandomCustomers(10);
  }

  /**
   * @summary Generate a list of random customers
   * @description Populates the customers array with a specified number of random customers using faker.
   * @param {number} count - The number of random customers to generate.
   */
  private generateRandomCustomers(count: number): void {
    for (let i = 0; i < count; i++) {
      const newCustomer: Omit<CustomerType, 'id'> = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
      };
      this.create(newCustomer); // Create and add the new customer to the array
    }
  }

  /**
   * @summary Find all customers
   * @description Retrieves all customer records from the customers array.
   * @returns {CustomerType[]} Array of all customers.
   */
  findAll(): CustomerType[] {
    return this.customers;
  }

  /**
   * @summary Find a customer by ID
   * @description Retrieves a single customer by their ID. Throws an exception if the customer is not found.
   * @param {number} id - The ID of the customer to retrieve.
   * @returns {CustomerType} The customer with the specified ID.
   * @throws {NotFoundException} If no customer with the specified ID is found.
   */
  findOne(id: number): CustomerType {
    const customer = this.customers.find(
      (customer) => customer.id === Number(id),
    );
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found.`);
    }
    return customer;
  }

  /**
   * @summary Create a new customer
   * @description Adds a new customer to the array with a unique ID. Validates the customer data before adding.
   * @param {Omit<CustomerType, 'id'>} customerData - Data for the new customer, excluding ID.
   * @returns {CustomerType} The newly created customer.
   * @throws {BadRequestException} If the provided customer data is invalid.
   */
  create(customerData: Omit<CustomerType, 'id'>): CustomerType {
    // Validate that only allowed fields are present in customerData
    validateDtoFields(customerData, ['name', 'email']);

    if (!customerData.name || !customerData.email) {
      throw new BadRequestException('Invalid customer data.');
    }

    const newCustomer = { id: this.counter++, ...customerData }; // Create customer with a unique ID
    this.customers.push(newCustomer); // Add the new customer to the array
    return newCustomer;
  }

  /**
   * @summary Update an existing customer
   * @description Updates the details of an existing customer identified by their ID. Only specified fields will be updated.
   * @param {number} id - The ID of the customer to update.
   * @param {Partial<Omit<CustomerType, 'id'>>} customerData - The updated customer data (can include partial fields).
   * @returns {CustomerType} The updated customer data.
   * @throws {NotFoundException} If no customer with the specified ID is found.
   */
  update(
    id: number,
    customerData: Partial<Omit<CustomerType, 'id'>>,
  ): CustomerType {
    // Validate that only allowed fields are present in customerData
    validateDtoFields(customerData, ['name', 'email']);

    const customer = this.findOne(id); // Find the customer to update
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found.`);
    }

    // Updating fields if provided
    if (customerData.name !== undefined) {
      customer.name = customerData.name;
    }
    if (customerData.email !== undefined) {
      customer.email = customerData.email;
    }

    return customer;
  }
}
