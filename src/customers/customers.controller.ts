import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { Customer } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer-dto';
import { UpdateCustomerDto } from './dto/update-customer-dto';
import { ViewCustomerDto } from './dto/view-customer-dto';

@ApiTags('Database Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({
    status: 200,
    description: 'List of customers',
    type: [ViewCustomerDto],
  })
  @Get('/all')
  async findAll(): Promise<ViewCustomerDto[]> {
    return this.customersService.findAll(); // Make sure ViewCustomerDto is aligned with Customer from Prisma
  }

  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer found',
    type: ViewCustomerDto,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Get('/info/:id')
  async findOne(@Param('id') id: number): Promise<ViewCustomerDto> {
    return this.customersService.findOne(id); // Ensure ViewCustomerDto matches Prisma Customer
  }

  @ApiOperation({ summary: 'Create a customer' })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    type: CreateCustomerDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('/create')
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.create(createCustomerDto);
  }

  @ApiOperation({ summary: 'Update a customer by ID' })
  @ApiBody({
    description: 'Customer data',
    type: UpdateCustomerDto,
    examples: {
      example1: {
        summary: 'Update a customer',
        value: { name: 'Jane Doe', email: 'jane.doe@example.com' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Customer updated successfully',
    type: UpdateCustomerDto,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Put('/update/:id')
  async update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.update(id, updateCustomerDto);
  }

  @ApiOperation({ summary: 'Delete a customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer deleted successfully',
    type: ViewCustomerDto,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Delete('/remove/:id')
  async remove(@Param('id') id: number): Promise<Customer> {
    return this.customersService.remove(id);
  }
}
