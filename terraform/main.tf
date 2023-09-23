# DynamoDB
resource "aws_dynamodb_table" "sensor_data" {
  name         = "SensorData"
  billing_mode = "PAY_PER_REQUEST"
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

  name        = "api/v1"
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
# ======================================= SNS  ==========================================================
resource "aws_sns_topic" "low_water_level_topic" {
  name            = "low_water_level_topic"
  delivery_policy = <<EOF
{
  "http": {
    "defaultHealthyRetryPolicy": {
      "minDelayTarget": 20,
      "maxDelayTarget": 20,
      "numRetries": 3,
      "numMaxDelayRetries": 0,
      "numNoDelayRetries": 0,
      "numMinDelayRetries": 0,
      "backoffFunction": "linear"
    },
    "disableSubscriptionOverrides": false,
    "defaultThrottlePolicy": {
      "maxReceivesPerSecond": 1
    }
  }
}
EOF
}
# ======================================= LAMBDA IAM ==========================================================
resource "aws_iam_role" "cs460_lambda_role" {
  name               = "cs460_lambda_role"
  assume_role_policy = data.aws_iam_policy_document.lambda_role_assume_role_policy.json
}

module "attach_role_and_policies" {
  source            = "./create_attach_iam_policies"
  lambda_role_arns  = [aws_iam_role.cs460_lambda_role.arn]
  policy_names      = [
    "cs460-cloudwatch-access-policy",
    "cs460-lambda-invoke-policy",
    "cs460-dynamodb-access-policy",
    "cs460-lambda-sns-policy",
    "cs460-lambda-sns-topic-policy",
  ]
  policy_descriptions = [
    "Policy for cloudwatch access",
    "Policy for lambda invokation",
    "Policy for DynamoDB access",
    "Policy for lambda to publish to SNS",
    "Policy for lambda to publish to sns topic",
  ]
  policy_documents   = [
    data.aws_iam_policy_document.cloudwatch_access_policy.json,
    data.aws_iam_policy_document.lambda_invoke_policy.json,
    data.aws_iam_policy_document.dynamodb_access_policy.json,
    data.aws_iam_policy_document.lambda_sns_policy.json,
    data.aws_iam_policy_document.lambda_sns_topic_policy.json,
  ]
}

#======================================== API Gateway routes (lambda)========================================
# example
# ========================= GET /get_product ========================================
resource "aws_lambda_function" "test_function" {
  function_name = "test_function"
  filename      = "../backend/test_function.zip"
  role          = aws_iam_role.cs460_lambda_role.arn
  handler       = "test_function.test_function.lambda_handler"

  source_code_hash = data.archive_file.test_function_zip.output_base64sha256
  runtime          = "python3.8"
  timeout          = 900
}
resource "aws_cloudwatch_log_group" "test_function" {
  name              = "/aws/lambda/${aws_lambda_function.test_function.function_name}"
  retention_in_days = 30
}
resource "aws_apigatewayv2_integration" "test_function_integration" {
  api_id             = aws_apigatewayv2_api.cs460_api_gw.id
  integration_uri    = aws_lambda_function.test_function.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST" #dont change this
}
resource "aws_apigatewayv2_route" "test_function_route" {
  api_id    = aws_apigatewayv2_api.cs460_api_gw.id
  route_key = "GET /test_function"
  target    = "integrations/${aws_apigatewayv2_integration.test_function_integration.id}"
}
resource "aws_lambda_permission" "test_function_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.test_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.cs460_api_gw.execution_arn}/*/*"
}

