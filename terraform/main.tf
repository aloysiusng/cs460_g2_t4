# DynamoDB
resource "aws_dynamodb_table" "sensor_data" {
  name         = "SensorData"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "plant_id"
  attribute {
    name = "plant_id"
    type = "S"
  }
  range_key = "time_stamp"
  attribute {
    name = "time_stamp"
    type = "N"
  }
}
resource "aws_dynamodb_table" "sensor_threshold_data" {
  name         = "SensorThresholdData"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "plant_id"
  attribute {
    name = "plant_id"
    type = "S"
  }
}
resource "aws_dynamodb_table" "user_to_plant" {
  name         = "UserToPlant"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "plant_id"
  attribute {
    name = "plant_id"
    type = "S"
  }
  range_key = "user_email"
  attribute {
    name = "user_email"
    type = "S"
  }
}

# ======================================= APIGW ==========================================================
# API Gateway general
resource "aws_apigatewayv2_api" "cs460_api_gw" {
  name          = "cs460_apigw"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["POST", "GET", "PUT", "DELETE", "OPTIONS"]
    max_age       = 300
    allow_headers = ["content-type"]
  }
}
resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.cs460_api_gw.name}"

  retention_in_days = 30
}
resource "aws_apigatewayv2_stage" "cs460_api_gw" {
  api_id = aws_apigatewayv2_api.cs460_api_gw.id

  name        = "api"
  auto_deploy = true
  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn
    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}
# ======================================= SES  ==========================================================
resource "aws_sesv2_email_identity" "cs460_email_identity" {
  email_identity = var.SES_EMAIL
}

# ======================================= IoT ==========================================================
resource "aws_iam_role" "cs460_iot_role" {
  name = "cs460_iot_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "iot.amazonaws.com"
      }
    }]
  })
}

resource "" "name" {
  
}

module "attach_role_and_policies_to_iot" {
  source            = "./create_attach_iam_policies"
  lambda_role_names = [aws_iam_role.cs460_iot_role.name]
  policy_names = [
    "cs460-iot-dynamodb-access-policy",
  ]
  policy_descriptions = [
    "Policy for DynamoDB access",
  ]
  policy_documents = [
    data.aws_iam_policy_document.dynamodb_access_policy.json,
  ]
}

resource "aws_iot_topic_rule" "plant_sensor_data_rule" {
  name        = "plant_sensor_data_rule"
  description = "Rule for plant sensor data"
  enabled     = true
  sql         = "SELECT plant_id, timestamp() as time_stamp, humidity_level, temperature, water_level, raining, last_watered_timestamp, sunlight_level, moisture_level FROM 'device/+/data'"
  sql_version = "2016-03-23"

  dynamodbv2 {
    put_item {
      table_name = aws_dynamodb_table.sensor_data.name
    }
    role_arn = aws_iam_role.cs460_iot_role.arn
  }
}

# ======================================= LAMBDA IAM ==========================================================
resource "aws_iam_role" "cs460_lambda_role" {
  name = "cs460_lambda_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

module "attach_role_and_policies" {
  source            = "./create_attach_iam_policies"
  lambda_role_names = [aws_iam_role.cs460_lambda_role.name]
  policy_names = [
    "cs460-cloudwatch-access-policy",
    "cs460-lambda-invoke-policy",
    "cs460-dynamodb-access-policy",
    "cs460-lambda-ses-policy",
    "cs460-lambda-iot-policy",
  ]
  policy_descriptions = [
    "Policy for cloudwatch access",
    "Policy for lambda invokation",
    "Policy for DynamoDB access",
    "Policy for lambda to publish to SES",
    "Policy for lambda to access IOT",
  ]
  policy_documents = [
    data.aws_iam_policy_document.cloudwatch_access_policy.json,
    data.aws_iam_policy_document.lambda_invoke_policy.json,
    data.aws_iam_policy_document.dynamodb_access_policy.json,
    data.aws_iam_policy_document.ses_identity_policy.json,
    data.aws_iam_policy_document.iot_allow_policy.json
  ]
}

#======================================== API Gateway routes (lambda)========================================
# ========================= GET /get_plant_info ========================================
module "get_plant_info" {
  source               = "./lambda_and_apigw"
  lambda_method        = "GET"
  lambda_function_name = "get_plant_info"
  # using absolue path of githubactions machine
  path_to_lambda_dir  = "../backend/lambda/get_plant_info"
  lambda_runtime      = "nodejs14.x"
  lambda_handler      = "index.handler"
  api_query_parameter = "/{proxy+}"
  lambda_environment_variables = {
    TABLE_NAME = aws_dynamodb_table.sensor_data.name
  }
  lambda_role_arn     = aws_iam_role.cs460_lambda_role.arn
  apigw_execution_arn = aws_apigatewayv2_api.cs460_api_gw.execution_arn
  apigw_id            = aws_apigatewayv2_api.cs460_api_gw.id
}
# ========================= POST /post_email_water_level_low_alert ========================================
module "post_email_water_level_low_alert" {
  source               = "./lambda_and_apigw"
  lambda_method        = "POST"
  lambda_function_name = "post_email_water_level_low_alert"
  # using absolue path of githubactions machine
  path_to_lambda_dir = "../backend/lambda/post_email_water_level_low_alert"
  lambda_runtime     = "nodejs14.x"
  lambda_handler     = "index.handler"
  lambda_environment_variables = {
    USER_TABLE_NAME = aws_dynamodb_table.user_to_plant.name
    SES_EMAIL       = var.SES_EMAIL
  }
  lambda_role_arn     = aws_iam_role.cs460_lambda_role.arn
  apigw_execution_arn = aws_apigatewayv2_api.cs460_api_gw.execution_arn
  apigw_id            = aws_apigatewayv2_api.cs460_api_gw.id
}
# ========================= GET /get_threshold ========================================
module "get_threshold" {
  source               = "./lambda_and_apigw"
  lambda_method        = "GET"
  lambda_function_name = "get_threshold"
  # using absolue path of githubactions machine
  path_to_lambda_dir  = "../backend/lambda/get_threshold"
  lambda_runtime      = "nodejs14.x"
  lambda_handler      = "index.handler"
  api_query_parameter = "/{proxy+}"
  lambda_environment_variables = {
    TABLE_NAME = aws_dynamodb_table.sensor_threshold_data.name
  }
  lambda_role_arn     = aws_iam_role.cs460_lambda_role.arn
  apigw_execution_arn = aws_apigatewayv2_api.cs460_api_gw.execution_arn
  apigw_id            = aws_apigatewayv2_api.cs460_api_gw.id
}

module "post_update_threshold" {
  source               = "./lambda_and_apigw"
  lambda_method        = "POST"
  lambda_function_name = "post_update_threshold"
  # using absolue path of githubactions machine
  path_to_lambda_dir = "../backend/lambda/post_update_threshold"
  lambda_runtime     = "nodejs14.x"
  lambda_handler     = "index.handler"
  lambda_environment_variables = {
    TABLE_NAME = aws_dynamodb_table.sensor_threshold_data.name
  }
  lambda_role_arn     = aws_iam_role.cs460_lambda_role.arn
  apigw_execution_arn = aws_apigatewayv2_api.cs460_api_gw.execution_arn
  apigw_id            = aws_apigatewayv2_api.cs460_api_gw.id
}

module "post_publish_payload_to_IoT" {
  source               = "./lambda_and_apigw"
  lambda_method        = "POST"
  lambda_function_name = "post_publish_payload_to_IoT"
  # using absolue path of githubactions machine
  path_to_lambda_dir = "../backend/lambda/post_publish_payload_to_IoT"
  lambda_runtime     = "nodejs14.x"
  lambda_handler     = "index.handler"

  lambda_environment_variables = {
    IOTENDPOINT = var.IOTENDPOINT
  }
  lambda_role_arn     = aws_iam_role.cs460_lambda_role.arn
  apigw_execution_arn = aws_apigatewayv2_api.cs460_api_gw.execution_arn
  apigw_id            = aws_apigatewayv2_api.cs460_api_gw.id
}