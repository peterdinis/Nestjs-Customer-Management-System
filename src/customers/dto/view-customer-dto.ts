import { ApiProperty } from '@nestjs/swagger';

export class ViewCustomerDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
