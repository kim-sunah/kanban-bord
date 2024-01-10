import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const access_token = req.headers.authorization.split(' ')[1];
    const refreshToken = req.headers.refreshtoken;

    if (!access_token || !refreshToken) {
      throw new UnauthorizedException('접근할 수 없습니다.');
    }

    // access token 검증
    const isVerifiedAccessToken =
      await this.authService.verifyAccessToken(access_token);

    const id = isVerifiedAccessToken.id;

    // access token 만료
    if (isVerifiedAccessToken.message === 'jwt expired') {
      // refresh token 검증
      const isVerifiedRefreshToken =
        await this.authService.verifyRefreshToken(refreshToken);

      // refresh token 만료
      if (isVerifiedRefreshToken.message === 'jwt expired') {
        throw new UnauthorizedException(
          '토큰이 만료되었습니다. 다시 로그인해주세요.',
        );
      }

      // access token 재발급
      const newAccessToken = await this.authService.createAccessToken(id);

      req.user = { id, access_token: newAccessToken, refreshToken };

      return true;
    }

    // access token 유효
    req.user = { id, access_token, refreshToken };

    return true;
  }
}
