#  DynamoDB iam
data "aws_iam_policy_document" "dynamodb_access_policy" {
  statement {
    effect  = "Allow"
    actions = ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:DeleteItem", "dynamodb:Scan", "dynamodb:Query"]
    resources = [
      aws_dynamodb_table.sensor_data.arn,
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
    actions = [
      "SES:SendEmail",
      "SES:SendRawEmail"
    ]
    effect    = "Allow"
    resources = ["*"]
  }
}

# lambda functions
data "archive_file" "test_function_zip" {
  type        = "zip"
  source_dir  = "../backend/test_function"
  output_path = "../backend/test_function.zip"
}
