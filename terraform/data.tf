#  DynamoDB iam
data "aws_iam_policy_document" "dynamodb_access_policy" {
  statement {
    effect  = "Allow"
    actions = ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:DeleteItem", "dynamodb:Scan", "dynamodb:Query", "dynamodb:UpdateItem"]
    resources = [
      aws_dynamodb_table.sensor_data.arn,
      aws_dynamodb_table.user_to_plant.arn,
      aws_dynamodb_table.sensor_threshold_data.arn
    ]
  }
}

# lambda iam
data "aws_iam_policy_document" "cloudwatch_access_policy" {
  statement {
    effect    = "Allow"
    actions   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["arn:aws:logs:*:*:*"]
  }
}
data "aws_iam_policy_document" "lambda_invoke_policy" {
  statement {
    effect    = "Allow"
    actions   = ["lambda:InvokeFunction"]
    resources = ["*"]
  }
}
data "aws_iam_policy_document" "ses_identity_policy" {
  statement {
    effect    = "Allow"
    actions   = ["ses:*"]
    resources = ["*"]
  }
}
data "aws_iam_policy_document" "iot_allow_policy" {
  statement {
    effect    = "Allow"
    actions   = ["iot:*"]
    resources = ["*"]
  }
}
