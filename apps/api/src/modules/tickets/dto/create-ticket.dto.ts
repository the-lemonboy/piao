import { TICKET_CATEGORIES, TicketCategory } from '@piaogen/shared';
import { IsIn, IsISO8601, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @MaxLength(80)
  title!: string;

  @IsString()
  @MaxLength(80)
  venue!: string;

  @IsISO8601()
  eventDate!: string;

  @IsIn(TICKET_CATEGORIES)
  category!: TicketCategory;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
