import { Injectable } from '@nestjs/common';
import { v2beta3 } from '@google-cloud/tasks';
@Injectable()
export class AppService {
  getHello(): string {
    return `Hello World!${process.env.CLOUD_TASKS_QUEUE_NAME}`;
  }

  async createTasks(): Promise<string> {
    const project = process.env.PROJECT_ID; // Your GCP Project id
    const queue = process.env.CLOUD_TASKS_QUEUE_NAME; // Name of your Queue
    const location = process.env.LOCATION; // The GCP region of your queue
    const url = `${process.env.URL}/tasks/handle`; // The full url path that the request will be sent to
    const email = process.env.SERVICE_ACCOUNT; // Cloud IAM service account
    const payload = 'Hello, World!'; // The task HTTP request body
    const client = new v2beta3.CloudTasksClient();
    const parent = client.queuePath(project, location, queue);

    // Convert message to buffer.
    const convertedPayload = JSON.stringify(payload);
    const body = Buffer.from(convertedPayload).toString('base64');

    const task = {
      httpRequest: {
        httpMethod: HttpMethod.POST,
        url,
        oidcToken: {
          serviceAccountEmail: email,
          audience: url,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      },
    };

    try {
      // Send create task request.
      const [response] = await client.createTask({ parent, task });
      console.log(`Created task ${response.name}`);
      return response.name;
    } catch (error) {
      // Construct error for Stackdriver Error Reporting
      console.error(Error(error.message));
    }
    return `tasks created to ${url}. `;
  }
}

enum HttpMethod {
  HTTP_METHOD_UNSPECIFIED = 0,
  POST = 1,
  GET = 2,
  HEAD = 3,
  PUT = 4,
  DELETE = 5,
  PATCH = 6,
  OPTIONS = 7,
}
