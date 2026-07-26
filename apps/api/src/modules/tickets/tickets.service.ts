import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketPayload, Ticket, TicketCategory, UpdateTicketPayload } from '@piaogen/shared';
import { PrismaService } from '../../common/prisma/prisma.service';

type PrismaTicket = {
  id: string;
  title: string;
  venue: string;
  eventDate: Date;
  category: string;
  imageUrl: string | null;
  note: string | null;
  city: string | null;
  detailsJson: string | null;
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
    const { details, ...ticketPayload } = payload;
    const ticket = await this.prisma.ticket.create({
      data: {
        ...ticketPayload,
        detailsJson: details ? JSON.stringify(details) : undefined,
        eventDate: new Date(payload.eventDate)
      }
    });

    return this.toTicket(ticket);
  }

  async update(id: string, payload: UpdateTicketPayload): Promise<Ticket> {
    await this.findOne(id);

    const { details, eventDate, ...ticketPayload } = payload;
    const ticket = await this.prisma.ticket.update({
      where: {
        id
      },
      data: {
        ...ticketPayload,
        ...(eventDate ? { eventDate: new Date(eventDate) } : {}),
        ...(details ? { detailsJson: JSON.stringify(details) } : {})
      }
    });

    return this.toTicket(ticket);
  }

  async remove(id: string): Promise<Ticket> {
    await this.findOne(id);

    const ticket = await this.prisma.ticket.delete({
      where: {
        id
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
      city: ticket.city ?? undefined,
      details: this.parseDetails(ticket.detailsJson),
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString()
    };
  }

  private parseDetails(value: string | null): Record<string, string> | undefined {
    if (!value) {
      return undefined;
    }

    try {
      const parsed = JSON.parse(value);

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return undefined;
      }

      return Object.entries(parsed).reduce<Record<string, string>>((result, [key, item]) => {
        if (typeof item === 'string') {
          result[key] = item;
        }

        return result;
      }, {});
    } catch {
      return undefined;
    }
  }
}
