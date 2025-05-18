import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CookieParserMiddleware } from './cookie-parser.middleware';
import { RoleTestingModule } from './role-testing/role-testing.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, RoleTestingModule],
  controllers: [],
  providers: [CookieParserMiddleware],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CookieParserMiddleware)
      .forRoutes('*');
  }
}
