import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { UserAuthDTO } from '../dto/userAuthDTO';
import { User } from '../entities/user.entity';

import { UserStatsService } from 'src/userStats/userStats.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userStatsService: UserStatsService,
  ) {}

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
    const oooBsId = uuidv4();
    const totBsId = uuidv4();
    user.fcmToken = userDTO.fcmToken;
    user.name = userDTO.userName;
    user.statsOneOnOneId = user.id;
    user.statsTwoOnTwoId = user.id;
    await this.userStatsService.createBaseStats(oooBsId);
    await this.userStatsService.createBaseStats(totBsId);
    await this.userStatsService.createStatsOneOnOne(user.id, oooBsId);
    await this.userStatsService.createStatsTwoOnTwo(user.id, totBsId);
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

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new Error(`User by ID ${id} not found`);
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
