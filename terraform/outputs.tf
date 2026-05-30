output "ami_id"            { value = data.aws_ami.ubuntu.id }
output "instance_id"       { value = aws_instance.this.id }
output "availability_zone" { value = aws_instance.this.availability_zone }
output "elastic_ip"        { value = aws_eip.this.public_ip }
output "ssh_command"       { value = "ssh -i aws-key.pem ubuntu@${aws_eip.this.public_ip}" }
