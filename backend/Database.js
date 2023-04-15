const AWS = require('aws-sdk');


class DatabaseConnection{
    #client;
    #tableName;

    constructor(region='us-east-1', tableName='kafkaTopicTable'){
        AWS.config.loadFromPath('./config.json');
        
        this.#client = new AWS.DynamoDB({region: region});
        this.#tableName = tableName

    }

    init(){

    }

    kafkaTopicTableExists(){

    }
}