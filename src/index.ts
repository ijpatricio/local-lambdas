import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {DynamoDB} from "aws-sdk"

const express = require('express');
const app = express();
const port = 3000;

const dynamoDBConfig = {
    endpoint: "http://dynamodb:8000",
    region: 'eu-west-1',
    secretAccessKey: 'DUMMYEXAMPLEKEY',
    accessKeyId: 'DUMMYIDEXAMPLE',
}
const dbClient = new DynamoDB(dynamoDBConfig)
const docClient = new DocumentClient(dynamoDBConfig)

const tableParams = {
    AttributeDefinitions: [
        {
            AttributeName: 'CUSTOMER_ID',
            AttributeType: 'N'
        },
        {
            AttributeName: 'CUSTOMER_NAME',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'CUSTOMER_ID',
            KeyType: 'HASH'
        },
        {
            AttributeName: 'CUSTOMER_NAME',
            KeyType: 'RANGE'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    },
    TableName: 'CUSTOMER_LIST',
    StreamSpecification: {
        StreamEnabled: false
    }
}

const insertParams = {
    TableName: 'CUSTOMER_LIST',
    Item: {
        'CUSTOMER_ID' : {N: '001'},
        'CUSTOMER_NAME' : {S: 'John Doe'}
    }
};

/*
 * Create the table. It will throw an error if already exists.
 */
app.get('/create-table', async (req, res) => {
    dbClient.createTable(tableParams, function (err, data) {
        if (err) {
            console.log("Error", err);
            res.json({
                msg: 'Error',
                err,
            })
        } else {
            console.log("Table Created", data);
            res.json({
                msg: 'Success',
                data,
            })
        }
    })
})

app.get('/', async (req, res) => {
    const list = await dbClient.listTables().promise()
    console.log('Found tables: ', list.TableNames);

    await dbClient.putItem(insertParams).promise()

    const result = await docClient.scan({
        TableName: 'CUSTOMER_LIST'
    }).promise()

    console.log('Found results: ', result.Items)

    res.send(JSON.stringify(result.Items))
});

app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});
