import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export function createDynamoDBClient(): DynamoDBDocumentClient {
  const endpoint = process.env.AWS_ENDPOINT_URL?.replace('localhost', '127.0.0.1');
  const client = new DynamoDBClient(
    endpoint
      ? {
          endpoint,
          region: 'us-east-1',
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test',
          },
        }
      : {},
  );
  return DynamoDBDocumentClient.from(client);
}
