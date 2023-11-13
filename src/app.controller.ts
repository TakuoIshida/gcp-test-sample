import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/tasks/create')
  createTask(): string {
    return this.appService.createTasks();
  }

  @Post('/tasks/handle')
  handleTasks(): string {
    return 'tasks completed';
  }
}
