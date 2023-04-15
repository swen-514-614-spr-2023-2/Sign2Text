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

        this.init();

    }

    init(){
        this.createMessageTable();
        this.createRoomTable();
    }

    createTableInDBIfNotExists(params){

        this.#dynamodb.listTables({},(err,data)=>{
            if(err) console.log(err, err.stack);

            else{
                if(data.TableNames.filter(name => name == params['TableName']).length == 0){
                    console.log(`Table: ${params['TableName']} does not exist. Creating...`);

                    this.#dynamodb.createTable(params,(err, data)=>{
                        if(err) console.log(err, err.stack);
                        else{
                            console.log("Table created successfully? Check");
                            console.log(data);
                        }
                    });
                }
            }
        });

    }

    createRoomTable(){
        const params = {
            AttributeDefinitions: [
                {
                    AttributeName: "roomName",
                    AttributeType: "S"
                },
                {
                    AttributeName: "roomId",
                    AttributeType: "S"
                }
            ],

            KeySchema: [
                {
                    AttributeName: "roomName",
                    KeyType : "HASH"
                },
                {
                    AttributeName: "roomId",
                    KeyType: "RANGE"
                }
            ],

            ProvisionedThroughput: {
                ReadCapacityUnits: 5, 
                WriteCapacityUnits: 5
            },

            TableName: "roomTable"
        };

        this.createTableInDBIfNotExists(params);
    }

    createMessageTable(){
        const params = {
            AttributeDefinitions: [
                {
                    AttributeName: "message",
                    AttributeType: "S"
                },
                {
                    AttributeName: "timestamp",
                    AttributeType: "S"
                }
            ],

            KeySchema: [
                {
                    AttributeName: "message",
                    KeyType : "HASH"
                },
                {
                    AttributeName: "timestamp",
                    KeyType: "RANGE"
                }
            ],

            ProvisionedThroughput: {
                ReadCapacityUnits: 5, 
                WriteCapacityUnits: 5
            },

            TableName: "messageTable" 
        }

        this.createTableInDBIfNotExists(params);
    }

    
}

async function test(){
    const dynamodb = new AWS.DynamoDB();

    var obj = new DatabaseConnection();
}

test();

//module.exports = DatabaseConnection;