import { Param, Body, Controller, Post, Get } from '@nestjs/common';

import { UserAuthDTO } from '../dto/userAuthDTO';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('registration')
  async registration(@Body() userDTO: UserAuthDTO) {
    return await this.userService.create(userDTO);
  }

  @Get('authorization/:name')
  async authorizeUser(@Param('name') name: string) {
    return await this.userService.getByName(name);
  }

  @Post('fcm')
  async updateFCM(@Body() userDTO: UserAuthDTO) {
    await this.userService.update(userDTO);
  }
}
