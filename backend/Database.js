//documentation: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/index.html
const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');


class DatabaseConnection{
    #dynamodb;
    #roomTable;
    #messageTable;

    constructor(accessKeyId, secretAccessKey, region='us-east-1', roomTable='roomTable', messageTable='messageTable'){
        AWS.config.update({
            accessKeyId: accessKeyId, secretAccessKey: secretAccessKey, region: region
        });
        //AWS.config.loadFromPath('./config.json');

        this.#dynamodb = new AWS.DynamoDB();
        this.#roomTable = roomTable;
        this.#messageTable = messageTable;

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
                else{
                    console.log("Did not create table "+params['TableName']+" since it already exists");
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

            TableName: this.#roomTable
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

            TableName: this.#messageTable 
        }

        this.createTableInDBIfNotExists(params);
    }

    createNewRoomInDB(roomId, roomName, otherParams={}){
        var params = {
            Item : {
                "roomName" : {
                    S : roomName
                },

                "roomId" : {
                    S : roomId
                },

            },

            ReturnConsumedCapacity : "TOTAL",
            TableName : this.#roomTable
        };

        for(const [key, value] of Object.entries(otherParams)){
            let temp = params['Item'];
            temp[key] = {
                S: value
            };
        }

        this.#dynamodb.putItem(params, (err,data)=>{
            if(err) console.log(err, err.stack);
            else{
                console.log(data);
            }
        });
    }

    getRoomInDB(roomId, roomName){
        var params = {
            Key: {
                "roomName": {
                    S: roomName
                },
                "roomId": {
                    S: roomId
                }
            },
            TableName : this.#roomTable

        };

        this.#dynamodb.getItem(params,(err,data)=>{
            if(err) console.log(err, err.stack);
            else console.log(data);
        });
    }

    storeMessageInMessageTable(message, timestamp){
        const params = {
            Item : {
                "message" : {
                    S : message
                },

                "timestamp" : {
                    S : timestamp
                }

            },

            ReturnConsumedCapacity: "TOTAL", 
            TableName: this.#messageTable
        };

        this.#dynamodb.putItem(params, (err, data)=>{
            if(err) console.log(err, err.stack);
            else{
                console.log(data);
            }
        })
    }

    
}

module.exports = DatabaseConnection;