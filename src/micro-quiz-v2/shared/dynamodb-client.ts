import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export function createDynamoDBClient(): DynamoDBDocumentClient {
  const endpoint = process.env.AWS_ENDPOINT_URL;
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
