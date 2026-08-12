terraform {

  backend "s3" {
    bucket               = "bucket_name_to_create"
    key                  = "terraform.tfstate"
    workspace_key_prefix = "env"
    region               = "us-east-1"
    # NOTE: the AWS profile is intentionally NOT hardcoded here so this works in CI.
    #  - Local:  `terraform init` is run with -backend-config="profile=matheus"
    #            (see the `terraform:init` npm script), so state access uses your profile.
    #  - CI:     no profile is passed; state access uses the credentials injected into
    #            the runner's environment (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY).
  }
}