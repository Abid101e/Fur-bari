import jwt, { SignOptions } from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class JWTService {
  private static accessTokenSecret = process.env.JWT_SECRET!;
  private static refreshTokenSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET! + '_refresh';
  private static accessTokenExpiry = (process.env.JWT_EXPIRES_IN || '15m') as string;
  private static refreshTokenExpiry = (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as string;

  static signAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    if (!this.accessTokenSecret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    const options: SignOptions = {
      expiresIn: this.accessTokenExpiry as any,
      issuer: 'farbari-api',
      audience: 'farbari-client'
    };

    return jwt.sign(payload, this.accessTokenSecret, options);
  }

  static signRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    if (!this.refreshTokenSecret) {
      throw new Error('JWT_REFRESH_SECRET environment variable is not defined');
    }

    const options: SignOptions = {
      expiresIn: this.refreshTokenExpiry as any,
      issuer: 'farbari-api',
      audience: 'farbari-client'
    };

    return jwt.sign(payload, this.refreshTokenSecret, options);
  }

  static signTokenPair(payload: Omit<JWTPayload, 'iat' | 'exp'>): TokenPair {
    return {
      accessToken: this.signAccessToken(payload),
      refreshToken: this.signRefreshToken(payload)
    };
  }

  static verifyAccessToken(token: string): JWTPayload {
    if (!this.accessTokenSecret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    return jwt.verify(token, this.accessTokenSecret, {
      issuer: 'farbari-api',
      audience: 'farbari-client'
    }) as JWTPayload;
  }

  static verifyRefreshToken(token: string): JWTPayload {
    if (!this.refreshTokenSecret) {
      throw new Error('JWT_REFRESH_SECRET environment variable is not defined');
    }

    return jwt.verify(token, this.refreshTokenSecret, {
      issuer: 'farbari-api',
      audience: 'farbari-client'
    }) as JWTPayload;
  }

  static decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static getTokenExpiry(token: string): Date | null {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return null;
    return new Date(decoded.exp * 1000);
  }
}
