import * as http from 'http';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { lambdaHandler } from './app';

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  const rawBody = Buffer.concat(chunks).toString();

  const event: APIGatewayProxyEvent = {
    httpMethod: req.method ?? 'GET',
    path: req.url ?? '/',
    body: rawBody || null,
    headers: req.headers as Record<string, string>,
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {} as APIGatewayProxyEvent['requestContext'],
    resource: '',
    isBase64Encoded: false,
  };

  try {
    const result = await lambdaHandler(event, {} as never);
    res.writeHead(result.statusCode, {
      'Content-Type': 'application/json',
      ...result.headers,
    });
    res.end(result.body ?? '');
  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

server.listen(PORT, () => {
  console.log(`Local server running at http://localhost:${PORT}`);
});
