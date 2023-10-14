const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  // check if query string parameters are valid
  if (
    event.queryStringParameters == null ||
    event.queryStringParameters.plant_id == null
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing query string parameters",
      }),
    };
  }

  const plant_id = event.queryStringParameters.plant_id;

  // get plant info from dynamodb
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: KeyConditionExpression,
    ExpressionAttributeNames: ExpressionAttributeNames,
    ExpressionAttributeValues: ExpressionAttributeValues,
  };

  // prepare dydb query params
  var {
    KeyConditionExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  } = prepareParamsHelper(plant_id, before_timestamp, after_timestamp);

  const data = await dynamoDb.query(params).promise();
  const output = data.Items

  // return plant info
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Get Threshold Data",
      output
    }),
  };
};

// helper function to prepare dydb query params
function prepareParamsHelper(plant_id, before_timestamp, after_timestamp) {
  var KeyConditionExpression = "#P = :plant_id";
  var ExpressionAttributeNames = {
    "#P": "plant_id",
  };

  var ExpressionAttributeValues = {
    ":plant_id": plant_id,
  };

  return {
    KeyConditionExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };
}
