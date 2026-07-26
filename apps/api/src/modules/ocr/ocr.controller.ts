import { Body, Controller, Post } from '@nestjs/common';
import { RecognizeTicketDto } from './dto/recognize-ticket.dto';
import { OcrService } from './ocr.service';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('ticket')
  async recognizeTicket(@Body() body: RecognizeTicketDto) {
    return {
      data: await this.ocrService.recognizeTicket(body.imageBase64),
      message: 'Ticket recognized'
    };
  }
}
