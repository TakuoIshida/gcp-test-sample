import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello World!${process.env.PROJECT_ID}`;
  }

  createTasks(): string {
    return 'Hello World!';
  }
}
