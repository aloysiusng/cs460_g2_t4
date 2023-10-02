data "archive_file" "lambda_function_zip" {
  type        = "zip"
  source_dir  = var.path_to_lambda_dir
  output_path = "/home/runner/work/cs460_g2_t4/cs460_g2_t4/backend/lambda/${var.lambda_function_name}.zip"
}
