output "api_gateway_invoke_url" {
  description = "Invoke URL for the API Gateway"
  value       = data.aws_apigatewayv2_api.cs460_api_gw.api_endpoint
}