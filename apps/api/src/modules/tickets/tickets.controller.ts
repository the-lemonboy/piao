import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
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

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateTicketDto) {
    return {
      data: await this.ticketsService.update(id, body),
      message: 'Ticket updated'
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      data: await this.ticketsService.remove(id),
      message: 'Ticket deleted'
    };
  }
}
