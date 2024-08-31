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
import { CreateCustomerDto } from './dto/create-customer-dto';
import { UpdateCustomerDto } from './dto/update-customer-dto';
import { ViewCustomerDto } from './dto/view-customer-dto';

@ApiTags('Database Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  /**
   * @summary Retrieve all customers
   * @description Fetches a list of all customers from the database.
   * @returns {Promise<ViewCustomerDto[]>} A promise that resolves to an array of customer data transfer objects (DTOs).
   */
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({
    status: 200,
    description: 'List of customers',
    type: [ViewCustomerDto],
  })
  @Get('/all')
  async findAll(): Promise<ViewCustomerDto[]> {
    return this.customersService.findAll();
  }

  /**
   * @summary Retrieve a customer by their ID
   * @description Fetches details of a single customer based on the provided ID.
   * @param {number} id - The ID of the customer to retrieve.
   * @returns {Promise<ViewCustomerDto>} A promise that resolves to a customer data transfer object (DTO).
   * @throws {NotFoundException} If no customer with the specified ID is found.
   */
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer found',
    type: ViewCustomerDto,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Get('/info/:id')
  async findOne(@Param('id') id: number): Promise<ViewCustomerDto> {
    return this.customersService.findOne(id);
  }

  /**
   * @summary Create a new customer
   * @description Adds a new customer to the database using the provided data.
   * @param {CreateCustomerDto} createCustomerDto - The data required to create a new customer.
   * @returns {Promise<ViewCustomerDto>} A promise that resolves to the newly created customer data transfer object (DTO).
   * @throws {BadRequestException} If the request data is invalid.
   */
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
  ): Promise<ViewCustomerDto> {
    return this.customersService.create(createCustomerDto);
  }

  /**
   * @summary Update an existing customer
   * @description Updates the details of an existing customer based on the provided ID and data.
   * @param {number} id - The ID of the customer to update.
   * @param {UpdateCustomerDto} updateCustomerDto - The updated data for the customer.
   * @returns {Promise<ViewCustomerDto>} A promise that resolves to the updated customer data transfer object (DTO).
   * @throws {NotFoundException} If the customer to be updated is not found.
   */
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
  ): Promise<ViewCustomerDto> {
    return this.customersService.update(id, updateCustomerDto);
  }

  /**
   * @summary Delete a customer by ID
   * @description Removes a customer from the database based on the provided ID.
   * @param {number} id - The ID of the customer to delete.
   * @returns {Promise<ViewCustomerDto>} A promise that resolves to the deleted customer data transfer object (DTO).
   * @throws {NotFoundException} If the customer to be deleted is not found.
   */
  @ApiOperation({ summary: 'Delete a customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer deleted successfully',
    type: ViewCustomerDto,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Delete('/remove/:id')
  async remove(@Param('id') id: number): Promise<ViewCustomerDto> {
    return this.customersService.remove(id);
  }
}
