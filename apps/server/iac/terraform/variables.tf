variable "aws_profile" {
  description = "Local AWS named profile for the provider. Defaults to 'matheus' for local runs; CI sets it to \"\" so the provider uses the runner's env credentials instead."
  type        = string
  default     = "matheus"
}

variable "example" {
  description = "Just an example"
  type        = string
  sensitive   = true
}


