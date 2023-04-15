const AWS = require('aws-sdk');

class DatabaseConnection{
    #client;
    #tableName;

    constructor(region='us-east-1'){
        this.#client = new AWS.DynamoDB({region});
        this.#tableName = 'kafkaTopicTable'
    }

    init(){
        
    }

    kafkaTopicTableExists(){

    }
}