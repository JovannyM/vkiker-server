import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStateService } from 'src/userStats/userStats.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { UserAuthDTO } from '../dto/userAuthDTO';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userStateService: UserStateService
  ) { }

  async getAll() {
    const users = await this.userRepository.find();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
    }));
  }

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
    const ooo = await this.userStateService.createOneOnOne(user.id);
    const tot = await this.userStateService.createTwoOnTwo(user.id);
    user.statsOneOnOneId = user.id;
    user.statsTwoOnTwoId = user.id;

    await this.userRepository.save(user);



    const newUser = await this.userRepository.save(user);
    return {
      access: true,
      message: '',
      id: newUser.id,
    };
  }

  async getByName(
    name: string,
  ): Promise<{ access: boolean; message: string; id: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { name },
    });
    if (existingUser) {
      return {
        access: true,
        message: '',
        id: existingUser.id,
      };
    }
    return {
      access: false,
      message: 'User with this name does not exist',
      id: '0',
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
