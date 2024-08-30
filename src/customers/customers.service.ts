import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer-dto';
import { UpdateCustomerDto } from './dto/update-customer-dto';
import { validateDtoFields } from 'src/utils/dto-check';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @summary Create a new customer
   * @description Adds a new customer to the database using the provided data.
   * @param {CreateCustomerDto} createCustomerDto - Data required to create a new customer.
   * @returns {Promise<Customer>} The newly created customer.
   * @throws {BadRequestException} If the creation of the customer fails.
   */
  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Validate that only allowed fields are present in createCustomerDto
    validateDtoFields(createCustomerDto, ['name', 'email']);

    // Create a new customer in the database
    const newCustomer = await this.prisma.customer.create({
      data: {
        ...createCustomerDto,
      },
    });

    if (!newCustomer) {
      throw new BadRequestException('Create customer failed');
    }

    return newCustomer;
  }

  /**
   * @summary Find all customers
   * @description Retrieves all customer records from the database.
   * @returns {Promise<Customer[]>} An array of all customers.
   * @throws {NotFoundException} If no customers are found.
   */
  async findAll(): Promise<Customer[]> {
    const allCustomers = await this.prisma.customer.findMany();
    if (!allCustomers.length) {
      throw new NotFoundException('No customers found');
    }

    return allCustomers;
  }

  /**
   * @summary Find a customer by ID
   * @description Retrieves a single customer by their ID.
   * @param {number} id - The ID of the customer to retrieve.
   * @returns {Promise<Customer>} The customer with the specified ID.
   * @throws {NotFoundException} If no customer with the specified ID is found.
   */
  async findOne(id: number): Promise<Customer> {
    const findOneCustomer = await this.prisma.customer.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!findOneCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found.`);
    }

    return findOneCustomer;
  }

  /**
   * @summary Update an existing customer
   * @description Updates the details of an existing customer identified by ID.
   * @param {number} id - The ID of the customer to update.
   * @param {UpdateCustomerDto} updateCustomerDto - The updated data for the customer.
   * @returns {Promise<Customer>} The updated customer data.
   * @throws {BadRequestException} If the update operation fails.
   */
  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const findOneCustomer = await this.findOne(id);

    // Validate that only allowed fields are present in updateCustomerDto
    validateDtoFields(updateCustomerDto, ['name', 'email']);

    // Update the customer in the database
    const updateCustomer = await this.prisma.customer.update({
      where: {
        id: findOneCustomer.id,
      },
      data: {
        ...updateCustomerDto,
      },
    });

    if (!updateCustomer) {
      throw new BadRequestException('Failed to update customer');
    }

    return updateCustomer;
  }

  /**
   * @summary Remove a customer
   * @description Deletes a customer from the database based on the provided ID.
   * @param {number} id - The ID of the customer to delete.
   * @returns {Promise<Customer>} The deleted customer data.
   * @throws {BadRequestException} If the deletion operation fails.
   */
  async remove(id: number): Promise<Customer> {
    const findOneCustomer = await this.findOne(id);

    // Delete the customer from the database
    const deleteCustomer = await this.prisma.customer.delete({
      where: {
        id: findOneCustomer.id,
      },
    });

    if (!deleteCustomer) {
      throw new BadRequestException('Failed to delete customer');
    }

    return deleteCustomer;
  }
}