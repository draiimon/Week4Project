aws_region = "ap-southeast-1"
environment = "dev"

# Real AWS account values
vpc_id     = "vpc-06845c6fc8ee58831"
subnet_ids = [
  "subnet-0f3ba0093dfbed64a",
  "subnet-0b547561bac6c234c",
  "subnet-0a05d6a1b3630dca1"
]

security_group_id = "sg-07eefbba6c112565c"
internet_gateway_id = "igw-009b817b22bbfe6c7"

allowed_cidr_blocks = ["0.0.0.0/0"]