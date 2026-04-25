import type { ScheduledHandler } from 'aws-lambda';
import { ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { createDynamoDBClient } from '../shared/dynamodb-client';
import type { AnswerRecord } from '../shared/types';

const ANSWER_KEY: Record<string, string> = {
  q001: 'A,B',
  q002: 'B,C',
  q003: 'D',
};

export function normaliseAnswers(raw: string): string {
  return raw
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .sort()
    .join(',');
}

export const handler: ScheduledHandler = async () => {
  const client = createDynamoDBClient();
  const tableName = process.env.TABLE_NAME;

  const scanResult = await client.send(
    new ScanCommand({
      TableName: tableName,
      FilterExpression: '#s = :pending',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':pending': 'pending' },
    }),
  );

  const pending = (scanResult.Items ?? []) as AnswerRecord[];

  for (const record of pending) {
    const { studentId, questionId, answers } = record;

    const correctRaw = ANSWER_KEY[questionId];
    if (correctRaw === undefined) {
      console.warn(`Unknown questionId "${questionId}" for studentId "${studentId}" — skipping`);
      continue;
    }

    const newStatus = normaliseAnswers(answers) === normaliseAnswers(correctRaw) ? 'correct' : 'incorrect';

    try {
      await client.send(
        new UpdateCommand({
          TableName: tableName,
          Key: { studentId, questionId },
          UpdateExpression: 'SET #s = :status, updatedAt = :updatedAt',
          ExpressionAttributeNames: { '#s': 'status' },
          ExpressionAttributeValues: {
            ':status': newStatus,
            ':updatedAt': new Date().toISOString(),
          },
        }),
      );
    } catch (err) {
      console.error(`Failed to update record for studentId "${studentId}", questionId "${questionId}":`, err);
    }
  }
};
