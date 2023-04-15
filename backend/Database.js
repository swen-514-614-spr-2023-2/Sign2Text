//documentation: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/index.html
const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');


class DatabaseConnection{
    #dynamodb;
    #tableName;

    constructor(region='us-east-1', tableName='kafkaTopicTable'){
        AWS.config.loadFromPath('./config.json');

        this.#dynamodb = new AWS.DynamoDB();
        this.#tableName = tableName

    }

    async init(options={}){
         
        
    }

    kafkaTopicTableExists(){

    }
}

async function test(){
    const dynamodb = new AWS.DynamoDB();

    // dynamodb.listTables({},(err,data)=>{
    //     if(err) console.log(err, err.stack)
    //     else console.log(data);
    // });

    dynamodb.deleteTable({TableName : "firstTable"},(err,data)=>{
        if(err) console.log(err, err.stack);
        else console.log(data);
    })
}

test();