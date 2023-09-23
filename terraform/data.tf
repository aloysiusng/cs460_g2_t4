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
data "aws_iam_policy_document" "lambda_role_assume_role_policy" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}
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
data "aws_iam_policy_document" "lambda_sns_policy" {
  statement {
    actions = [
      "sns:Publish" # This allows Lambda to publish messages to SNS
    ]
    resources = [
      "arn:aws:sns:your-region:your-account-id:your-topic-name" # Replace with your SNS topic ARN
    ]
  }
}
data "aws_iam_policy_document" "lambda_sns_topic_policy" {
  statement {
    actions = [
      "SNS:Subscribe",
      "SNS:SetTopicAttributes",
      "SNS:RemovePermission",
      "SNS:Receive",
      "SNS:Publish",
      "SNS:ListSubscriptionsByTopic",
      "SNS:GetTopicAttributes",
      "SNS:DeleteTopic",
      "SNS:AddPermission",
    ]
    # condition {
    #   test     = "StringEquals"
    #   variable = "AWS:SourceArn"
    #   # change to lambda arn that will invoke SNS
    #   values = [aws_lambda_function.test_function.arn] 
    # }
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["sns.amazonaws.com"]
    }
    resources = [
      aws_sns_topic.low_water_level_topic.arn,
    ]
  }
}



# lambda functions
data "archive_file" "test_function_zip" {
  type        = "zip"
  source_dir  = "../backend/test_function"
  output_path = "../backend/test_function.zip"
}
