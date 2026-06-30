import { Body, Controller, Get, Headers, Patch, Post } from '@nestjs/common';
import { WechatLoginDto } from './dto/wechat-login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('wechat/login')
  async loginWithWechat(@Body() body: WechatLoginDto) {
    return {
      data: await this.authService.loginWithWechat(body),
      message: 'Logged in'
    };
  }

  @Get('me')
  async me(@Headers('authorization') authorization = '') {
    return {
      data: await this.authService.getSession(this.parseToken(authorization))
    };
  }

  @Patch('me')
  async updateMe(@Headers('authorization') authorization = '', @Body() body: UpdateProfileDto) {
    return {
      data: await this.authService.updateProfile(this.parseToken(authorization), body),
      message: 'Profile updated'
    };
  }

  @Post('logout')
  async logout(@Headers('authorization') authorization = '') {
    await this.authService.logout(this.parseToken(authorization));

    return {
      data: true,
      message: 'Logged out'
    };
  }

  private parseToken(authorization: string): string {
    return authorization.replace(/^Bearer\s+/i, '');
  }
}
