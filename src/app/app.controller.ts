import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CreateCustomerDto } from 'src/customers/dto/create-customer-dto';
import { UpdateCustomerDto } from 'src/customers/dto/update-customer-dto';
import { ViewCustomerDto } from 'src/customers/dto/view-customer-dto';
import { DataService } from 'src/data/data.service';

@ApiTags('Customers without database')
@Controller()
export class AppController {
  constructor(private readonly dataService: DataService) {}

  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({
    status: 200,
    description: 'Return all customers.',
    type: [ViewCustomerDto],
  })
  @Get('/all')
  allCustomers(): ViewCustomerDto[] {
    return this.dataService.findAll();
  }

  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Return a customer.',
    type: ViewCustomerDto,
  })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  @Get('/info/:id')
  findOne(@Param('id') id: number): ViewCustomerDto {
    return this.dataService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new customer' })
  @ApiBody({
    description: 'Customer data',
    type: CreateCustomerDto,
    examples: {
      example1: {
        summary: 'Create a customer',
        value: { name: 'John Doe', email: 'john.doe@example.com' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Customer created.',
    type: CreateCustomerDto,
  })
  @Post('/create')
  create(@Body() customerData: CreateCustomerDto): ViewCustomerDto {
    return this.dataService.create(customerData);
  }

  @ApiOperation({ summary: 'Update an existing customer' })
  @ApiParam({ name: 'id', description: 'Customer ID', type: 'number' })
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
    description: 'Customer updated.',
    type: UpdateCustomerDto,
  })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  @Put('/update/:id')
  update(
    @Param('id') id: number,
    @Body() customerData: UpdateCustomerDto,
  ): ViewCustomerDto{
    return this.dataService.update(id, customerData);
  }
}
