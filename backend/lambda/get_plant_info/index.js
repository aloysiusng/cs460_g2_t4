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
  const before_time_stamp = event.queryStringParameters.before_time_stamp;
  const after_time_stamp = event.queryStringParameters.after_time_stamp;

  if (before_time_stamp > after_time_stamp) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "before_time_stamp must be before after_time_stamp",
      }),
    };
  }
  // prepare dydb query params
  var { KeyConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues } = prepareParamsHelper(plant_id, before_time_stamp, after_time_stamp);

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
function prepareParamsHelper(plant_id, before_time_stamp, after_time_stamp) {
  var KeyConditionExpression = "#P = :plant_id";
  var ExpressionAttributeNames = {
    "#P": "plant_id",
  };
  var ExpressionAttributeValues = {
    ":plant_id": plant_id,
  };

  if (before_time_stamp != null && after_time_stamp != null) {
    // both => between the 2 time_stamps
    KeyConditionExpression += " AND #T BETWEEN :before_time_stamp AND :after_time_stamp";
    ExpressionAttributeValues[":before_time_stamp"] = before_time_stamp;
    ExpressionAttributeValues[":after_time_stamp"] = after_time_stamp;
  } else if (before_time_stamp == null && after_time_stamp != null) {
    // only after time_stamp
    KeyConditionExpression += " AND #T >= :after_time_stamp";
    ExpressionAttributeValues[":after_time_stamp"] = after_time_stamp;
  } else if (after_time_stamp != null && after_time_stamp == null) {
    // only before time_stamp
    KeyConditionExpression += " AND #T <= :before_time_stamp";
    ExpressionAttributeValues[":before_time_stamp"] = before_time_stamp;
  }
  if (ExpressionAttributeValues[":before_time_stamp"] != null || ExpressionAttributeValues[":after_time_stamp"] != null) {
    ExpressionAttributeNames["#T"] = "time_stamp";
  }

  return { KeyConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues };
}
