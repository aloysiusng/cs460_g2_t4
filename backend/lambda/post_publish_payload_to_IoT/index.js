const AWS = require("aws-sdk");

exports.handler = async (event, context) => {
  // TODO implement
  const plant_id = JSON.parse(event.body).plant_id;
  const payload = JSON.parse(event.body).payload;
  const iotData = new AWS.IotData({
    endpoint: process.env.IOTENDPOINT, // IoTEndpoint
  });

  const data = await iotData
    .publish({
      topic: `water/${plant_id}/data`,
      payload: JSON.stringify(payload),
      qos: 1,
    })
    .promise();
  // always return 200, SNS will handle the error
  return {
    statusCode: 200,
    body: JSON.stringify("Message published!"),
  };
};
