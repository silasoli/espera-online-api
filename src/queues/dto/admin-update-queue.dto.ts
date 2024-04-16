import { PartialType } from '@nestjs/swagger';
import { AdminCreateQueueDto } from './admin-create-queue.dto';

export class AdminUpdateQueueDto extends PartialType(AdminCreateQueueDto) {}
