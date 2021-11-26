import { Controller, Get } from '@nestjs/common';

import { UserService } from '../user/user.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.getAll();
  }
}
