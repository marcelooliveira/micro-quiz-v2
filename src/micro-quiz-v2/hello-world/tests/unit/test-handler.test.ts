import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { lambdaHandler } from '../../app';

describe('Tests index', () => {
  it('verifies successful response', async () => {
    const result = await lambdaHandler({} as APIGatewayProxyEvent, {} as Context);

    expect(result).toBeDefined();
    expect(result.statusCode).toEqual(200);
    expect(result.body).toBeDefined();

    const response = JSON.parse(result.body);
    expect(response.message).toEqual('hello world');
  });
});
