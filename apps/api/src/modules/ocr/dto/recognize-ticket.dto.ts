import { IsString, MaxLength } from 'class-validator';

export class RecognizeTicketDto {
  @IsString()
  @MaxLength(8_000_000)
  imageBase64!: string;
}
