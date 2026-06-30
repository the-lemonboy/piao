import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketPayload, Ticket, TicketCategory } from '@piaogen/shared';
import { PrismaService } from '../../common/prisma/prisma.service';

type PrismaTicket = {
  id: string;
  title: string;
  venue: string;
  eventDate: Date;
  category: string;
  imageUrl: string | null;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Ticket[]> {
    const tickets = await this.prisma.ticket.findMany({
      orderBy: {
        eventDate: 'desc'
      }
    });

    return tickets.map((ticket) => this.toTicket(ticket));
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.prisma.ticket.findUnique({
      where: {
        id
      }
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return this.toTicket(ticket);
  }

  async create(payload: CreateTicketPayload): Promise<Ticket> {
    const ticket = await this.prisma.ticket.create({
      data: {
        ...payload,
        eventDate: new Date(payload.eventDate)
      }
    });

    return this.toTicket(ticket);
  }

  private toTicket(ticket: PrismaTicket): Ticket {
    return {
      id: ticket.id,
      title: ticket.title,
      venue: ticket.venue,
      eventDate: ticket.eventDate.toISOString(),
      category: ticket.category as TicketCategory,
      imageUrl: ticket.imageUrl ?? undefined,
      note: ticket.note ?? undefined,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString()
    };
  }
}
