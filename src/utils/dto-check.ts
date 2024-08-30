import { BadRequestException } from '@nestjs/common';

/**
 * Validate that the given DTO only contains fields that are in the allowed fields list.
 *
 * @param dto - The DTO object to validate.
 * @param allowedFields - List of allowed fields.
 * @throws BadRequestException - Throws an exception if any invalid fields are found.
 */
export function validateDtoFields(
  dto: Record<string, any>,
  allowedFields: string[],
): void {
  if (typeof dto !== 'object' || dto === null) {
    throw new BadRequestException('Invalid DTO: Expected an object.');
  }

  const dtoFields = Object.keys(dto);
  const invalidFields = dtoFields.filter(
    (field) => !allowedFields.includes(field),
  );

  if (invalidFields.length > 0) {
    throw new BadRequestException(
      `Invalid fields: ${invalidFields.join(', ')}`,
    );
  }
}
