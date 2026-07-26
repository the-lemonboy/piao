import { TICKET_CATEGORIES, TicketCategory } from '@piaogen/shared';
import { IsIn, IsISO8601, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  venue?: string;

  @IsOptional()
  @IsISO8601()
  eventDate?: string;

  @IsOptional()
  @IsIn(TICKET_CATEGORIES)
  category?: TicketCategory;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  city?: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, string>;
}
