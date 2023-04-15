//documentation: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/index.html
const {DynamoDBClient, ListTablesCommand} = require('@aws-sdk/client-dynamodb');


class DatabaseConnection{
    #client;
    #tableName;

    constructor(region='us-east-1', tableName='kafkaTopicTable'){
        AWS.config.loadFromPath('./config.json');

        this.#client = new DynamoDBClient({region: region});
        this.#tableName = tableName

    }

    async init(options={}){
        const data = await this.#client.send(new ListTablesCommand(options));
        
    }

    kafkaTopicTableExists(){

    }
}