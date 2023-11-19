import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/tasks/create')
  async createTask(): Promise<string> {
    return this.appService.createTasks();
  }

  @Post('/tasks/handle')
  handleTasks(): string {
    return 'tasks completed';
  }

  @Post('/topic/create')
  async createTopic(@Body() subscriptionMessage: string): Promise<void> {
    this.appService.createTopic(subscriptionMessage);
  }

  @Post('/topic/exec')
  async execTopic(@Body() subscriptionName: string): Promise<string> {
    await this.appService.subscribeMessage(subscriptionName);
    return 'topic executed';
  }
}
