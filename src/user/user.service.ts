import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { UserAuthDTO } from '../dto/userAuthDTO';
import { User } from '../entities/Users.Entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(
    userDTO: UserAuthDTO,
  ): Promise<{ access: boolean; message: string; id: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { name: userDTO.userName },
    });
    if (existingUser) {
      return {
        access: false,
        message: 'User with this name already exists',
        id: '0',
      };
    }
    const user = new User();
    user.id = uuidv4();
    user.fcmToken = userDTO.fcmToken;
    user.name = userDTO.userName;
    const newUser = await this.userRepository.save(user);
    return {
      access: true,
      message: '',
      id: newUser.id,
    };
  }

  async update(userDTO: UserAuthDTO) {
    const existingUser = await this.userRepository.findOne({
      where: { name: userDTO.userName },
    });
    if (!existingUser) {
      return {
        access: false,
        message: 'User with this name not found',
        id: '0',
      };
    }
    existingUser.fcmToken = userDTO.fcmToken;
    await this.userRepository.save(existingUser);
  }
}
