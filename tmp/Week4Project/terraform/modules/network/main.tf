# VPC
resource "aws_vpc" "oak_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = merge(var.common_tags, {
    Name = "${var.name_prefix}-vpc"
  })
}

# Subnets
resource "aws_subnet" "public_subnet_1" {
  vpc_id                  = aws_vpc.oak_vpc.id
  cidr_block              = var.subnet_cidrs[0]
  availability_zone       = "${var.region}a"
  map_public_ip_on_launch = true

  tags = merge(var.common_tags, {
    Name = "${var.name_prefix}-public-1"
  })
}

resource "aws_subnet" "public_subnet_2" {
  vpc_id                  = aws_vpc.oak_vpc.id
  cidr_block              = var.subnet_cidrs[1]
  availability_zone       = "${var.region}b"
  map_public_ip_on_launch = true

  tags = merge(var.common_tags, {
    Name = "${var.name_prefix}-public-2"
  })
}

# Internet Gateway
resource "aws_internet_gateway" "oak_igw" {
  vpc_id = aws_vpc.oak_vpc.id

  tags = merge(var.common_tags, {
    Name = "${var.name_prefix}-igw"
  })
}

# Route Table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.oak_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.oak_igw.id
  }

  tags = merge(var.common_tags, {
    Name = "${var.name_prefix}-public-rt"
  })
}

# Route Table Association
resource "aws_route_table_association" "public_rta_1" {
  subnet_id      = aws_subnet.public_subnet_1.id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "public_rta_2" {
  subnet_id      = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.public_rt.id
}

# Security Group
resource "aws_security_group" "oak_sg" {
  name        = "${var.name_prefix}-sg"
  description = "Security group for OakTree application"
  vpc_id      = aws_vpc.oak_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.common_tags, {
    Name = "${var.name_prefix}-sg"
  })
}