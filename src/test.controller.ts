import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get('access')
  async getA() {
    return { access: true, test: 0, message: '' };
  }

  @Get('noaccess')
  async getB() {
    return { access: false, test: 0, message: 'User not found' };
  }
}
