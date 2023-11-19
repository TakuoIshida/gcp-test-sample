import { Injectable } from '@nestjs/common';
import { v2beta3 } from '@google-cloud/tasks';
import { PubSub, v1 } from '@google-cloud/pubsub';

const projectId = process.env.PROJECT_ID; // Your GCP Project id
const topicName = process.env.PUB_SUB_TOPIC_NAME; // Your GCP Project id
const subscriptionName = process.env.PUB_SUB_SUBSCRIPTION_NAME; // Your GCP Project id

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
    const client = new v2beta3.CloudTasksClient();
    const parent = client.queuePath(project, location, queue);

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

  async publish(subscriptionMessage: string): Promise<void> {
    console.log(`topicName: ${topicName}`);
    const topic = new PubSub({ projectId }).topic(topicName);

    // Send a message to the topic
    await topic.publishMessage({ data: Buffer.from(subscriptionMessage) });
  }

  async subscribeMessage(): Promise<void> {
    const subClient = new v1.SubscriberClient();
    const subscription = subClient.subscriptionPath(
      projectId,
      subscriptionName,
    );

    const request = {
      subscription,
      maxMessages: 10,
      returnImmediately: true,
    };

    // The subscriber pulls a specified number of messages.
    const [response] = await subClient.pull(request);

    const ackIds = [];
    if (response.receivedMessages.length === 0) {
      console.log('there is no subscription message.');
      return;
    }

    for (const message of response.receivedMessages || []) {
      console.log(`Received message: ${message.message.data}`);
      if (message.ackId) {
        ackIds.push(message.ackId);
      }
    }
    console.log(`ackIds: ${ackIds}`);
    if (ackIds.length !== 0) {
      // Acknowledge all of the messages. You could also acknowledge
      // these individually, but this is more efficient.
      const ackRequest = {
        subscription,
        ackIds: ackIds,
      };

      await subClient.acknowledge(ackRequest);
    }

    console.log('Done.');
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
