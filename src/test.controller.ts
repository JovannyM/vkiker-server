import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class ItemController {
  @Get()
  async getTest() {
    return { test: 0 };
  }
}
