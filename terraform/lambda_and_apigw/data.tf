data "archive_file" "lambda_function_zip" {
  type        = "zip"
  source_dir  = var.path_to_lambda_dir
  output_path = path.root + "/../backend/lambda/${var.lambda_function_name}.zip"
}
