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

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    validateDtoFields(createCustomerDto, ['name', 'email']);
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

  async findAll(): Promise<Customer[]> {
    const allCustomers = await this.prisma.customer.findMany();
    if (!allCustomers.length) {
      throw new NotFoundException('No customers found');
    }

    return allCustomers;
  }

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

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const findOneCustomer = await this.findOne(id);
    validateDtoFields(updateCustomerDto, ['name', 'email']);
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

  async remove(id: number): Promise<Customer> {
    const findOneCustomer = await this.findOne(id);
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
