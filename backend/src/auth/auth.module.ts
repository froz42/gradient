import { Module } from '@nestjs/common';
import { AuthCommand } from './auth.command';
import { AuthService } from './auth.service';
import { AuthGuard, GqlAuthGuard } from './guards/auth.guard';

@Module({
  providers: [AuthCommand, AuthService, AuthGuard, GqlAuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
