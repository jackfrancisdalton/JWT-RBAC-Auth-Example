import { Module } from '@nestjs/common';
import { RoleTestingController } from './role-testing.controller';
import { AuthModule } from 'src/auth/auth.module';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [AuthModule],
  controllers: [RoleTestingController],
  providers: [RolesGuard]
})
export class RoleTestingModule {}
