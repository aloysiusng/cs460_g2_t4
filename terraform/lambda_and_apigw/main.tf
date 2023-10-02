resource "aws_lambda_function" "lambda_function" {
  function_name = var.lambda_function_name
  filename      = data.archive_file.lambda_function_zip.output_path
  role          = var.lambda_role_arn
  handler       = var.lambda_handler

  source_code_hash = data.archive_file.lambda_function_zip.output_base64sha256
  runtime          = var.lambda_runtime
  timeout          = 900
  environment {
    variables = var.lambda_environment_variables
  }
}
resource "aws_cloudwatch_log_group" "lambda_function_log_group" {
  name              = "/aws/lambda/${var.lambda_function_name}"
  retention_in_days = 14
}
resource "aws_apigatewayv2_integration" "lambda_function_integration" {
  api_id           = var.apigw_id
  integration_type = "AWS_PROXY"

  integration_uri    = aws_lambda_function.lambda_function.invoke_arn
  integration_method = "POST"
}
resource "aws_apigatewayv2_route" "lambda_function_route" {
  api_id    = var.apigw_id
  route_key = "${var.lambda_method} /${var.lambda_function_name}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_function_integration.id}"
}
resource "aws_lambda_permission" "lambda_function_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.apigw_execution_arn}/*/*"
}