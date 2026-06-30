import { IsOptional, IsString, MaxLength } from 'class-validator';

export class WechatLoginDto {
  @IsString()
  code!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  nickname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatarUrl?: string;
}
