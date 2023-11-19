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
  async createTopic(
    @Body() body: { subscriptionMessage: string },
  ): Promise<string> {
    console.log(body.subscriptionMessage);
    await this.appService.createTopic(body.subscriptionMessage);
    return `subscriptionMessage: ${body.subscriptionMessage} is pushed`;
  }

  @Post('/topic/exec')
  async execTopic(@Body() body: { subscriptionName: string }): Promise<string> {
    console.log(body.subscriptionName);
    await this.appService.subscribeMessage(body.subscriptionName);
    return `topic executed to ${body.subscriptionName}`;
  }
}
