import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Cloud Tasks
  @Post('/tasks/create')
  async createTask(): Promise<string> {
    return this.appService.createTasks();
  }

  @Post('/tasks/handle')
  handleTasks(): string {
    return 'tasks completed';
  }

  // Cloud Pub/Sub
  @Post('/subscribe/publish')
  async publishSubscriptionMessage(
    @Body() body: { subscriptionMessage: string },
  ): Promise<string> {
    console.log(body.subscriptionMessage);
    await this.appService.publish(body.subscriptionMessage);
    return `subscriptionMessage: ${body.subscriptionMessage} is pushed`;
  }

  // pull型
  // https://cloud.google.com/pubsub/docs/pull?hl=ja
  @Get('/subscribe/pull')
  async pullSubscriptionMessage(): Promise<string> {
    console.log('/subscribe/pull');
    await this.appService.subscribeMessage();
    return `pull subscription`;
  }

  // push型
  // https://cloud.google.com/pubsub/docs/samples/pubsub-create-push-subscription?hl=ja
  @Post('/subscribe/push')
  async pushSubscriptionMessage(
    @Body() payload: { messageId: string; subscriptionMessage: string },
  ): Promise<void> {
    console.log(JSON.stringify(payload));
    await this.appService.pushSubscriptionPayload(payload);
  }

  @Post('/subscribe/push/message')
  subscribePushMessage(
    @Body() body: { messageId: string; subscriptionMessage: string },
  ): void {
    console.log(`@Post('/subscribe/push/message')`);
    console.log(JSON.stringify(body));
  }
}
