import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello World!${process.env.CLOUD_TASKS_QUEUE_NAME}`;
  }

  createTasks(): string {
    return 'Hello World!';
  }
}
