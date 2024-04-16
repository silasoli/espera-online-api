import { BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

class ValidationUtilCls {
  validObjectId(_id: string): void {
    if (!isValidObjectId(_id))
      throw new BadRequestException('Formato de ID inválido');
  }
}

export const ValidationUtil = new ValidationUtilCls();
