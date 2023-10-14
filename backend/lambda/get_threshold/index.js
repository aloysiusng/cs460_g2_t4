const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    // Check if query string parameters are valid
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

    // Prepare DynamoDB query parameters
    const params = {
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "#P = :plant_id",
      ExpressionAttributeNames: {
        "#P": "plant_id",
      },
      ExpressionAttributeValues: {
        ":plant_id": plant_id,
      },
    };

    const data = await dynamoDb.query(params).promise();

    if (data.Items.length === 0) {
      return {
        statusCode: 404, // Not Found
        body: JSON.stringify({
          message: "No threshold data found for the provided plant_id.",
        }),
      };
    }

    // Return plant info
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Get Threshold Data",
        data: data.Items,
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500, // Internal Server Error
      body: JSON.stringify({
        message: "Internal Server Error",
      }),
    };
  }
};
