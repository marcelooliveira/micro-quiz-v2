import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { createDynamoDBClient } from '../shared/dynamodb-client';

const ANSWERS_REGEX = /^[a-zA-Z](,[a-zA-Z])*$/;

function json(statusCode: number, body: unknown): APIGatewayProxyResult {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export const old_lambdaHandler = async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'answer-submission',
        }),
    };

    return response;
};

export const lambdaHandler = async (
    event: APIGatewayProxyEvent,
    context: Context
) => {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(event.body ?? '{}') as Record<string, unknown>;
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const { studentId, questionId, answers } = parsed;

  for (const field of ['studentId', 'questionId', 'answers'] as const) {
    const value = parsed[field];
    if (typeof value !== 'string' || value.trim() === '') {
      return json(400, { error: `Missing required field: ${field}` });
    }
  }

  if (!ANSWERS_REGEX.test(answers as string)) {
    return json(400, { error: 'Invalid answers format: only letters and commas are allowed' });
  }

  const client = createDynamoDBClient();
  try {
    await client.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          studentId,
          questionId,
          answers,
          status: 'pending',
          updatedAt: new Date().toISOString(),
        },
      }),
    );
  } catch (err) {
    console.error('Error saving answer submission:', err);
    return json(500, { error: 'Internal error' });
  }

  return json(200, { studentId, questionId, status: 'pending' });
};
