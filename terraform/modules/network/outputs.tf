output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.oak_vpc.id
}

output "subnet_ids" {
  description = "IDs of the subnets"
  value       = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.oak_sg.id
}