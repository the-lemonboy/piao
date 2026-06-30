import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthSession,
  UpdateUserProfilePayload,
  UserProfile,
  UserStats,
  WechatLoginPayload
} from '@piaogen/shared';
import { createHash, randomUUID } from 'crypto';
import { PrismaService } from '../../common/prisma/prisma.service';

type PrismaUser = {
  id: string;
  openId: string;
  nickname: string;
  avatarUrl: string | null;
  phone: string | null;
  email: string | null;
  gender: string | null;
  birthday: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
};

interface WechatSession {
  openid: string;
  session_key?: string;
  unionid?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  async loginWithWechat(payload: WechatLoginPayload): Promise<AuthSession> {
    const wechatSession = await this.resolveWechatSession(payload);
    const user = await this.prisma.user.upsert({
      where: {
        openId: wechatSession.openid
      },
      update: {
        nickname: payload.nickname || undefined,
        avatarUrl: payload.avatarUrl || undefined
      },
      create: {
        openId: wechatSession.openid,
        nickname: payload.nickname || '票根收藏者',
        avatarUrl: payload.avatarUrl
      }
    });
    const token = randomUUID();

    await this.prisma.session.create({
      data: {
        token,
        userId: user.id
      }
    });

    return {
      token,
      user: this.toUserProfile(user),
      stats: await this.buildStats(user.id)
    };
  }

  async getSession(token: string): Promise<AuthSession> {
    const session = await this.prisma.session.findUnique({
      where: {
        token
      },
      include: {
        user: true
      }
    });

    if (!session) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      token,
      user: this.toUserProfile(session.user),
      stats: await this.buildStats(session.user.id)
    };
  }

  async updateProfile(token: string, payload: UpdateUserProfilePayload): Promise<AuthSession> {
    const session = await this.prisma.session.findUnique({
      where: {
        token
      },
      include: {
        user: true
      }
    });

    if (!session) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.prisma.user.update({
      where: {
        id: session.userId
      },
      data: {
        nickname: this.cleanText(payload.nickname) || undefined,
        avatarUrl: this.cleanOptionalText(payload.avatarUrl),
        phone: this.cleanOptionalText(payload.phone),
        email: this.cleanOptionalText(payload.email),
        gender: this.cleanOptionalText(payload.gender),
        birthday: this.cleanOptionalText(payload.birthday),
        bio: this.cleanOptionalText(payload.bio)
      }
    });

    return {
      token,
      user: this.toUserProfile(user),
      stats: await this.buildStats(user.id)
    };
  }

  async logout(token: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        token
      }
    });
  }

  private async resolveWechatSession(payload: WechatLoginPayload): Promise<WechatSession> {
    const appId = this.configService.get<string>('WECHAT_APPID');
    const secret = this.configService.get<string>('WECHAT_SECRET');

    if (!appId || !secret) {
      return {
        openid: this.createDevOpenId(payload)
      };
    }

    const url = new URL('https://api.weixin.qq.com/sns/jscode2session');
    url.searchParams.set('appid', appId);
    url.searchParams.set('secret', secret);
    url.searchParams.set('js_code', payload.code);
    url.searchParams.set('grant_type', 'authorization_code');

    const response = await fetch(url);
    const data = (await response.json()) as WechatSession & { errcode?: number; errmsg?: string };

    if (!data.openid) {
      throw new UnauthorizedException(data.errmsg || 'Wechat login failed');
    }

    return data;
  }

  private createDevOpenId(payload: WechatLoginPayload): string {
    const stableSource = payload.nickname || payload.avatarUrl || payload.code;
    const hash = createHash('sha256').update(stableSource).digest('hex').slice(0, 24);
    return `dev_${hash}`;
  }

  private cleanText(value?: string): string | undefined {
    const text = value?.trim();
    return text || undefined;
  }

  private cleanOptionalText(value?: string): string | null | undefined {
    if (value === undefined) {
      return undefined;
    }

    return value.trim() || null;
  }

  private async buildStats(userId: string): Promise<UserStats> {
    const [totalTickets, cityRows, firstTicket] = await Promise.all([
      this.prisma.ticket.count({
        where: {
          OR: [{ userId }, { userId: null }]
        }
      }),
      this.prisma.ticket.findMany({
        where: {
          OR: [{ userId }, { userId: null }],
          city: {
            not: null
          }
        },
        select: {
          city: true
        },
        distinct: ['city']
      }),
      this.prisma.ticket.findFirst({
        where: {
          OR: [{ userId }, { userId: null }]
        },
        orderBy: {
          eventDate: 'asc'
        },
        select: {
          eventDate: true
        }
      })
    ]);
    const days = firstTicket
      ? Math.max(1, Math.ceil((Date.now() - firstTicket.eventDate.getTime()) / 86_400_000))
      : 0;

    return {
      totalTickets,
      cities: cityRows.length,
      days
    };
  }

  private toUserProfile(user: PrismaUser): UserProfile {
    return {
      id: user.id,
      openId: user.openId,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl ?? undefined,
      phone: user.phone ?? undefined,
      email: user.email ?? undefined,
      gender: user.gender ?? undefined,
      birthday: user.birthday ?? undefined,
      bio: user.bio ?? undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }
}
