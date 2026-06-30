import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  async findAll() {
    return {
      data: await this.ticketsService.findAll()
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      data: await this.ticketsService.findOne(id)
    };
  }

  @Post()
  async create(@Body() body: CreateTicketDto) {
    return {
      data: await this.ticketsService.create(body),
      message: 'Ticket created'
    };
  }
}
