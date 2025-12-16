import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RewardService } from './reward.service';
import { MarkViewedDto } from './dto/mark-viewed.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-guards/jwt-auth.guard';
import { EmailVerifiedGuard } from '../../common/guards/email-verified/email-verified.guard';
import { RequireEmailVerification } from '../../common/guards/email-verified/email-verified.decorator';
import { Throttle } from '@nestjs/throttler';
import type { RequestWithUser } from '../habits/interfaces/request-user.interface';

@Controller('rewards')
@UseGuards(JwtAuthGuard, EmailVerifiedGuard)
@RequireEmailVerification()
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get()
  getAllRewards() {
    return this.rewardService.getAllRewards();
  }

  @Get('user')
  getUserRewards(@Request() req: RequestWithUser) {
    return this.rewardService.getUserRewards(req.user.userId);
  }

  @Post('check')
  @Throttle({ default: { ttl: 60000, limit: 50 } })
  checkRewards(
    @Request() req: RequestWithUser,
    @Body() body: { habitId?: string },
  ) {
    return this.rewardService.checkAndUnlockRewards(
      req.user.userId,
      body.habitId,
    );
  }

  @Post('mark-viewed')
  @Throttle({ default: { ttl: 60000, limit: 30 } })
  markAsViewed(
    @Request() req: RequestWithUser,
    @Body() markViewedDto: MarkViewedDto,
  ) {
    return this.rewardService.markRewardsAsViewed(
      req.user.userId,
      markViewedDto.rewardIds,
    );
  }
}
