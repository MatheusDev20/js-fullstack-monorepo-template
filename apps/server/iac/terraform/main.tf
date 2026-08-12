provider "aws" {
  region = "us-east-1"
  # Local runs use a named profile (default "matheus" — see variables.tf).
  # CI sets TF_VAR_aws_profile="" so this resolves to null and the provider
  # falls back to the default credential chain (env vars on the runner).
  profile = var.aws_profile != "" ? var.aws_profile : null
}

##############################################
# ------------ AWS Current User ------------ #
##############################################
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

locals {
  stage  = terraform.workspace == "default" ? "prod" : terraform.workspace
  prefix = "service"
  service_name    = "js_full_stack_template"                                # Nome do serviço: nomeia a Lambda, a API Gateway e o zip
  artifact_bucket = "artifact_js_fullstack_template"           # Bucket S3 (nome legado) que guarda o zip — mantido para não recriar o recurso
  lambda_name     = "${local.service_name}__${local.stage}" # Usado para nomear a Lambda no painel da AWS
}

variable "service_version" {
  description = "Version of the service"
  type        = string
}
