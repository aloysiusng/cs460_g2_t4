const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);
  if (!body.plant_id || !body.payload) {
    return {
      statusCode: 400,
      body: JSON.stringify("Missing plant_id or payload"),
    };
  }

  const iotData = new AWS.IotData({
    endpoint: process.env.IOTENDPOINT, // IoTEndpoint
  });

  const data = await iotData
    .publish({
      topic: `water/${body.plant_id}/data`,
      payload: JSON.stringify(body.payload),
      qos: 1,
    })
    .promise();
  // always return 200, SNS will handle the error
  return {
    statusCode: 200,
    body: JSON.stringify("Message published!"),
  };
};
