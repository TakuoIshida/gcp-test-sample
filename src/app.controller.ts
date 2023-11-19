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

  @Post('/subscribe/publish')
  async createTopic(
    @Body() body: { subscriptionMessage: string },
  ): Promise<string> {
    console.log(body.subscriptionMessage);
    await this.appService.publish(body.subscriptionMessage);
    return `subscriptionMessage: ${body.subscriptionMessage} is pushed`;
  }

  @Get('/subscribe/pull')
  async execTopic(): Promise<string> {
    console.log('/subscribe/pull');
    await this.appService.subscribeMessage();
    return `subscribe pulled`;
  }
}
