//documentation: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/index.html
const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const AWS = require('aws-sdk');
//AWS.config.loadFromPath('./config.json');


class DatabaseConnection{
    #dynamodb;
    #roomTable;
    #messageTable;
    allRooms;
    lastRoomCreated;

    constructor(accessKeyId, secretAccessKey, region='us-east-1', roomTable='roomTable', messageTable='messageTable'){
        AWS.config.update({
            accessKeyId: accessKeyId, secretAccessKey: secretAccessKey, region: region
        });
        //AWS.config.loadFromPath('./config.json');

        this.#dynamodb = new AWS.DynamoDB();
        this.#roomTable = roomTable;
        this.#messageTable = messageTable;
        this.allRooms = undefined;

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

    async createNewRoomInDB(roomName, otherParams={}){
        var complete = false;
        while(!complete){
            var roomId = this.rng(0,1000000);
            var params = {
                Item : {
                    "roomName" : {
                        S : roomId
                    },

                    "roomId" : {
                        S : roomId
                    },
                    "NAME" : {
                        S: roomName
                    }

                },

                Expected: {
                    'roomId': {
                        Exists: false
                    }
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

            await this.#dynamodb.putItem(params, (err,data)=>{
                //if(err) console.log(roomId,err, err.stack);
                //else{
                 //   console.log(data);
                //}
            }).promise().then(data =>{
                complete=true;
                this.lastRoomCreated = roomId;
            }).catch(async (e) =>{
                console.log("err");
                complete=false;
            });
        }
    }

    getRoomInDB(roomId, roomName){
        var params = {
            Key: {
                "roomName": {
                    S: roomId
                },
                "roomId": {
                    S: roomId
                },
                "NAME" : {
                    S: roomName
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

    generateNewId(){
        var num = this.rng(0,10000000);
        console.log(num, typeof(num));

        var params = {
            Key: {
                "roomName": {
                    S: num
                },
                "roomId": {
                    S: num
                }
            },
            TableName : this.#roomTable

        };

        this.#dynamodb.getItem(params,(err,data)=>{
            if(err) console.log(err, err.stack);
            else{
                if(data.Item){
                    return this.generateNewId();
                }
                else{
                    console.log(num);
                    return num;
                }
            }
        });
    }

    rng(min,max){
        return ""+Math.floor((Math.random() * (max - min) + min));
    }

    
    async getAllRoomsInDB(){
        console.log("248","here");
        var params = {
            ExpressionAttributeNames: {
                "#N" : "NAME",
                "#I" : "roomId"
            },

            ProjectionExpression: "#N, #I",
            TableName: this.#roomTable

        };

        var v;
        await this.#dynamodb.scan(params,(err,data)=>{
            if(err) console.log(err);
            else{
                //console.log(data,"264");
                // let ret = []
                // data['Items'].forEach(item => {
                //     console.log(item);
                //     let t = {};
                //     t['roomId'] = item['roomId'];
                //     t['name'] = item['NAME'];
                //     ret.push(t);
                // });
                // console.log("finish");
                // return ret;
            }
        }).promise().then((data)=>{
            let ret = []
                data['Items'].forEach(item => {
                    console.log(item);
                    let t = {};
                    t['roomId'] = item['roomId'];
                    t['name'] = item['NAME'];
                    ret.push(t);
                });
                console.log("finish");
                this.allRooms = ret;
                //return ret;
        });

        //console.log("277",ret);
    }
    
}


module.exports = DatabaseConnection;




