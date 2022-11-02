const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const docClient = new AWS.DynamoDB.DocumentClient();

const TableName = process.env.AWS_DYNAMODB_TABLENAME || "Test";

const DB = {
    async get(pk, sk) {
        return new Promise(async (resolve, reject) => {
            try {
                const params = {
                    TableName,
                    Key: {
                        pk,
                        sk,
                    },
                };
                const data = await docClient.get(params).promise();
                resolve(data.Item);
            } catch (error) {
                reject({
                    message: "There was an error while fetching data",
                    error,
                });
            }
        });
    },
    async queryBeginsWith(pk, sk) {
        return new Promise(async (resolve, reject) => {
            try {
                const params = {
                    TableName,
                    KeyConditionExpression:
                        "pk = :pk AND begins_with(sk,:starts)",
                    ExpressionAttributeValues: {
                        ":pk": pk,
                        ":starts": sk,
                    },
                };
                const data = await docClient.query(params).promise();
                resolve(data.Items.reverse());
            } catch (error) {
                reject({
                    message: "There was an error while fetching data",
                    error,
                });
            }
        });
    },
    async queryWithFilter(pk, sk, field, value) {
        return new Promise(async (resolve, reject) => {
            try {
                const params = {
                    TableName,
                    KeyConditionExpression:
                        "pk = :pk AND begins_with(sk,:starts)",
                    FilterExpression: "#field = :value",
                    ExpressionAttributeNames: {
                        "#field": field,
                    },
                    ExpressionAttributeValues: {
                        ":pk": pk,
                        ":starts": sk,
                        ":value": value,
                    },
                    ScanIndexForward: false,
                };
                const data = await docClient.query(params).promise();
                resolve(data.Items);
            } catch (error) {
                reject({
                    message: "There was an error while fetching data",
                    error,
                });
            }
        });
    },
    async queryWithUserIndex(sk, pk) {
        return new Promise(async (resolve, reject) => {
            try {
                const params = {
                    TableName,
                    IndexName: "user-event-index",
                    KeyConditionExpression:
                        "#sk = :sk AND begins_with(pk,:starts)",
                    ExpressionAttributeNames: {
                        "#sk": "sk",
                    },
                    ExpressionAttributeValues: {
                        ":sk": sk,
                        ":starts": pk,
                    },
                    ScanIndexForward: false,
                };
                const data = await docClient.query(params).promise();
                resolve(data.Items);
            } catch (error) {
                reject({
                    message: "There was an error while fetching data",
                    error,
                });
            }
        });
    },
    async put(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const params = {
                    TableName,
                    Item: data,
                };
                const res = await docClient.put(params).promise();
                resolve(data);
            } catch (error) {
                reject({
                    message: "There was an error while adding data",
                    error,
                });
            }
        });
    },
    async batchInsert(data) {
        return new Promise(async (resolve, reject) => {
            try {
              const params = {
                RequestItems: {
                    [TableName]: data.map((item) => ({
                        PutRequest: {
                            Item: item,
                        },
                    })),
                },
            };
              const res =  await docClient.batchWrite(params).promise();
                resolve(data);
            } catch (error) {
                reject({
                    message: "There was an error while adding data",
                    error,
                });
            }
        });
    },
    async delete(pk, sk) {
        return new Promise(async (resolve, reject) => {
            try {
                const params = {
                    TableName,
                    Key: {
                        pk,
                        sk,
                    },
                };
                const data = await docClient.delete(params).promise();
                resolve(data);
            } catch (error) {
                reject({
                    message: "There was an error while deleting data",
                    error,
                });
            }
        });
    },
};

const generateId = () => {
    let date = new Date().toLocaleDateString().split("/").reverse().join("");
    let time = new Date().toTimeString().split(" ")[0].split(":").join("");
    return date.concat(time);
};

module.exports = { DB, generateId };
