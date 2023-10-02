variable "lambda_method" {
  type        = string
  description = "GET or POST or PUT or DELETE"
}
variable "lambda_function_name" {
  type        = string
  description = "ensure that the folder name of the lambda, and the file name is the same"
}
variable "path_to_lambda_dir" {
  type        = string
  description = "e.g ../backend/lambda/test_function"
}
variable "lambda_runtime" {
  type        = string
  description = "nodejs or python3.8..."
}
variable "lambda_handler" {
  type        = string
  description = "e.g index.handler"
}
variable "lambda_role_arn" {
  type        = string
  description = "to be injected from other resource created earlier"
}
variable "apigw_execution_arn" {
  type        = string
  description = "to be injected from other resource created earlier"
}
variable "apigw_id" {
  type        = string
  description = "to be injected from other resource created earlier"
}
variable "api_query_parameter" {
  type        = string
  default     = ""
  description = "defaults to empty string, use /{proxy+} if you want to use query parameters"
}
variable "lambda_environment_variables" {
  type        = map(string)
  description = "e.g {TABLE_NAME = aws_dynamodb_table.plant_info_table.name}"
  default     = {}
}