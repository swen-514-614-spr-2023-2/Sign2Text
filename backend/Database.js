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

    init(){
        this.#dynamodb.listTables({},(err,data)=>{
            if(err) console.log(err, err.stack);

            else{
                if(data.TableNames.filter(name => name == this.#tableName).length == 0){
                    console.log(`Table: ${this.#tableName} does not exist. Creating...`);
                    this.createTableInDB();
                }
            }
        })
        
    }

    createTableInDB(){
        const params = {
            TableName : this.#tableName,

            AttributeDefinitions: [
                {
                    AttributeName : "topicName",
                    AttributeType : "S"
                }
            ],

            KeySchema: [
                {
                    AttributeName : "topicName",
                    KeyType : "HASH"
                }
            ],

            ProvisionedThroughput: {
                ReadCapacityUnits: 5, 
                WriteCapacityUnits: 5
            }
        
        }

        this.#dynamodb.createTable(params,(err, data)=>{
            if(err) console.log(err, err.stack);
            else{
                console.log("Table created successfully? Check");
                console.log(data);
            }
        });
    }
}

async function test(){
    const dynamodb = new AWS.DynamoDB();

    // dynamodb.listTables({},(err,data)=>{
    //     if(err) console.log(err, err.stack)
    //     else console.log(data);
    // });

    // dynamodb.deleteTable({TableName : "firstTable"},(err,data)=>{
    //     if(err) console.log(err, err.stack);
    //     else console.log(data);
    // });

    var obj = new DatabaseConnection();
    obj.init();

}

test();