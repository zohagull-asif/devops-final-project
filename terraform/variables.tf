variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  type    = string
  default = "taskflow-devops"
}

variable "instance_type" {
  type    = string
  default = "m7i-flex.large"
}

variable "key_name" {
  type    = string
  default = "taskflow-key"
}

variable "ssh_cidr" {
  type    = string
  default = "0.0.0.0/0"
}
