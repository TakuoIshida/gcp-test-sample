import { Injectable } from '@nestjs/common';
import { v2beta3 } from '@google-cloud/tasks';
import { PubSub } from '@google-cloud/pubsub';
import { v4 as uuidv4 } from 'uuid';

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

  async createTopic(subscriptionMessage: string): Promise<void> {
    console.log(`topicName: ${topicName}`);
    const topic = new PubSub({ projectId }).topic(topicName);
    console.log(`topic: ${topic}`);

    // Creates a subscription on that new topic
    const [subscription] = await topic.createSubscription(
      subscriptionName + uuidv4(),
    );
    console.log(`subscription: ${subscription}`);

    // Receive callbacks for new messages on the subscription
    subscription.on('message', (message) => {
      console.log('Received message:', message.data.toString());
      process.exit(0);
    });

    // Receive callbacks for errors on the subscription
    subscription.on('error', (error) => {
      console.error('Received error:', error);
      process.exit(1);
    });

    // Send a message to the topic
    await topic.publishMessage({ data: Buffer.from(subscriptionMessage) });
  }

  async subscribeMessage(subscriptionName: string): Promise<void> {
    const subscription = new PubSub({ projectId })
      .topic(topicName)
      .subscription(subscriptionName);
    console.log(`Message subscribed`);
    const messageHandler = async (message) => {
      console.log(`message: ${message.data.toString()}`);
      await message.ackWithResponse();
    };
    subscription.on('message', messageHandler);

    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      console.log(`message received.`);
    }, 1000);
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
