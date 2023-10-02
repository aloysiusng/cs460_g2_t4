output "absolute_lambda_path" {
  value = pathexpand(var.path_to_lambda_dir)
}
