const AWS = require("aws-sdk");

const EMAIL_HTML_BODY = "Dear user, <br/> <br/> Your water tank level is low, please refill it.<br/><i>This is an autogenerated email, please do not reply. </i>  <br/> <br/> Best regards, <br/> Plantify Team";
const EMAIL_SUBJECT = "[Plantify Warning!] Water tank level is low";

exports.handler = async (event, context) => {
  const plant_id = JSON.parse(event.body).plant_id;

  // get user email from dynamodb
  const dydbResponse = await getUserEmail(plant_id);
  if (dydbResponse.statusCode != 200) {
    return {
      statusCode: dydbResponse.statusCode,
      body: JSON.stringify({
        message: dydbResponse.message,
      }),
    };
  }

  var user_email = dydbResponse.user_email;
  // send email to user
  var sesResponse = await SESsendEmailHelper(user_email);

  // if there is messageId means success, if null = failed
  var statusCode = sesResponse.MessageId != null ? 200 : 500;
  var message = sesResponse.MessageId != null ? "Email alert sent successfully!" : "Email alert failed to send";
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      message: message,
    }),
  };
};

// helper function to send email
async function SESsendEmailHelper(user_email) {
  const ses = new AWS.SES();
  const SESparams = {
    Destination: {
      ToAddresses: [user_email],
    },
    Message: {
      Body: {
        Html: {
          Data: EMAIL_HTML_BODY,
        },
      },
      Subject: {
        Data: EMAIL_SUBJECT,
      },
    },
    Source: process.env.SES_EMAIL,
  };
  // send email
  const response = await ses.sendEmail(SESparams).promise();

  return response;
}
// helper function to get user email from dydb
async function getUserEmail(plant_id) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const dydbparams = {
    TableName: process.env.USER_TABLE_NAME,
    ExpressionAttributeValues: {
      ":plant_id": plant_id,
    },
    KeyConditionExpression: "plant_id = :plant_id",
  };
  const data = await dynamoDb.query(dydbparams).promise();
  var statusCode = data.Count == 1 ? 200 : 404;
  var message = data.Count == 1 ? "success" : "plant_id not found";
  var user_email = data.Count == 1 ? data.Items[0].user_email : "";

  return {
    statusCode: statusCode,
    message: message,
    user_email: user_email,
  };
}
