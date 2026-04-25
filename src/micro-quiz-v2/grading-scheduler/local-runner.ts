import type { ScheduledEvent } from 'aws-lambda';
import { handler } from './app';

const INTERVAL_MS = 60_000;

// Minimal EventBridge scheduled event stub
const scheduledEvent: ScheduledEvent = {
  version: '0',
  id: 'local-runner',
  source: 'aws.events',
  account: 'local',
  time: new Date().toISOString(),
  region: 'us-east-1',
  resources: [],
  'detail-type': 'Scheduled Event',
  detail: {},
};

async function runOnce(): Promise<void> {
  console.log(`[${new Date().toISOString()}] Running grading scheduler...`);
  try {
    await handler(scheduledEvent, {} as never, () => {});
    console.log(`[${new Date().toISOString()}] Grading scheduler finished.`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Grading scheduler error:`, err);
  }
}

runOnce();
setInterval(runOnce, INTERVAL_MS);

console.log(`Grading scheduler local runner started — firing every ${INTERVAL_MS / 1000}s`);
