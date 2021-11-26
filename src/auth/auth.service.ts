import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { UserAuthDTO } from '../dto/userAuthDTO';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async createUser(user: UserAuthDTO) {
    return await this.userService.create(user);
  }
}
