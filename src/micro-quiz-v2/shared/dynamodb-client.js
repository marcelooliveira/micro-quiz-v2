"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDynamoDBClient = createDynamoDBClient;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
function createDynamoDBClient() {
    const endpoint = process.env.AWS_ENDPOINT_URL;
    const client = new client_dynamodb_1.DynamoDBClient(endpoint
        ? {
            endpoint,
            region: 'us-east-1',
            credentials: {
                accessKeyId: 'test',
                secretAccessKey: 'test',
            },
        }
        : {});
    return lib_dynamodb_1.DynamoDBDocumentClient.from(client);
}
//# sourceMappingURL=dynamodb-client.js.map