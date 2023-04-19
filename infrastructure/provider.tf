provider "aws" {
  access_key = var.access_key
  secret_key = var.secret_key
  region     = var.aws_region
  #if you are running from AWS ec2 linux instance please use bellow credentials section
  #shared_credentials_file = "$HOME/.aws/credentials"
  #profile = "default"
}
