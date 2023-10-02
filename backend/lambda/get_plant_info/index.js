const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();
/*
  # hash key -> :PK
  hash_key = "plant_id"
  attribute {
    name = "plant_id"
    type = "S"
  }
  # sort key -> :SK
  range_key = "timestamp"
  attribute {
    name = "timestamp"
    type = "S"
  }
*/
exports.handler = async (event, context) => {
  // get plant_id from event (query params)
  const plant_id = event.queryStringParameters.plant_id;

  // get plant info from dynamodb
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "#plant_id = :plant_id",
    ExpressionAttributeNames: {
      "#plant_id": "plant_id",
    },
    ExpressionAttributeValues: {
      ":plant_id": plant_id,
    },
  };
  const data = await dynamoDb.query(params).promise();
  console.log(data);

  // return plant info
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "get_plant_info",
      data: data,
    }),
  };
};
