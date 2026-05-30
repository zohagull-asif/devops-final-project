terraform {
  backend "s3" {
    bucket         = "taskflow-devops-tfstate-126462206818"
    key            = "terraform/main.tfstate"
    region         = "us-east-1"
    dynamodb_table = "taskflow-devops-tflock"
    encrypt        = true
  }
}
