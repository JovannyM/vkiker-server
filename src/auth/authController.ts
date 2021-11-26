import { Body, Controller, Post } from '@nestjs/common';

import { UserAuthDTO } from '../dto/userAuthDTO';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post()
  async createNewUser(@Body() userDTO: UserAuthDTO) {
    return await this.userService.create(userDTO);
  }
}
