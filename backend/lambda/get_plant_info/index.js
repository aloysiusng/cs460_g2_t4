const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  // check if query string parameters are valid
  if (event.queryStringParameters == null || event.queryStringParameters.plant_id == null) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing query string parameters",
      }),
    };
  }
  const plant_id = event.queryStringParameters.plant_id;
  const before_timestamp = event.queryStringParameters.before_timestamp;
  const after_timestamp = event.queryStringParameters.after_timestamp;

  if (before_timestamp > after_timestamp) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "before_timestamp must be before after_timestamp",
      }),
    };
  }
  // prepare dydb query params
  var { KeyConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues } = prepareParamsHelper(plant_id, before_timestamp, after_timestamp);

  // get plant info from dynamodb
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: KeyConditionExpression,
    ExpressionAttributeNames: ExpressionAttributeNames,
    ExpressionAttributeValues: ExpressionAttributeValues,
  };
  const data = await dynamoDb.query(params).promise();

  // return plant info
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Get plant info",
      data: data.Items,
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

  if (before_timestamp != null && after_timestamp != null) {
    // both => between the 2 timestamps
    KeyConditionExpression += " AND #T BETWEEN :before_timestamp AND :after_timestamp";
    ExpressionAttributeValues[":before_timestamp"] = before_timestamp;
    ExpressionAttributeValues[":after_timestamp"] = after_timestamp;
  } else if (before_timestamp == null && after_timestamp != null) {
    // only after timestamp
    KeyConditionExpression += " AND #T >= :after_timestamp";
    ExpressionAttributeValues[":after_timestamp"] = after_timestamp;
  } else if (after_timestamp != null && after_timestamp == null) {
    // only before timestamp
    KeyConditionExpression += " AND #T <= :before_timestamp";
    ExpressionAttributeValues[":before_timestamp"] = before_timestamp;
  }
  if (ExpressionAttributeValues[":before_timestamp"] != null || ExpressionAttributeValues[":after_timestamp"] != null) {
    ExpressionAttributeNames["#T"] = "timestamp";
  }

  return { KeyConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues };
}
