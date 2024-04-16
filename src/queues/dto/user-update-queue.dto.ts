import { PartialType } from '@nestjs/swagger';
import { UserCreateQueueDto } from './user-create-queue.dto';

export class UserUpdateQueueDto extends PartialType(UserCreateQueueDto) {}
