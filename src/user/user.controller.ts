import { Controller, Get, Param } from '@nestjs/common';

import { UserStatsDTO } from '../dto/userStatsDTO';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserStatsDTO> {
    return await this.userService.getById(id);
  }
}
