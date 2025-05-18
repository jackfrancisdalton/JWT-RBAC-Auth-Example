import { Injectable, NestMiddleware } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CookieParserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    cookieParser()(req, res, next);
  }
}