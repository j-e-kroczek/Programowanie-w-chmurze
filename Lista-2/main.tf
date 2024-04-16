terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1"
}

resource "tls_private_key" "rsa_4096" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

variable "ssh_key_name" {
  description = "Name of the SSH key pair"
  default     = "key_ssh.pem"
}

resource "aws_key_pair" "ssh_key" {
  key_name   = var.ssh_key_name
  public_key = tls_private_key.rsa_4096.public_key_openssh
}

resource "local_file" "private_ssh_key" {
  content  = tls_private_key.rsa_4096.private_key_pem
  filename = var.ssh_key_name
}

resource "aws_instance" "tictactoe_server" {
  ami                         = "ami-0c101f26f147fa7fd"
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.server_subnet.id
  vpc_security_group_ids      = [aws_security_group.server_security_group.id]
  associate_public_ip_address = true
  key_name                    = aws_key_pair.ssh_key.key_name

  tags = {
    Name = "TTTServer"
  }

  connection {
    type        = "ssh"
    user        = "ec2-user"
    private_key = file(var.ssh_key_name)
    host        = self.public_ip
  }

  provisioner "remote-exec" {
    inline = [
      "sudo yum update -y",
      "sudo yum install -y docker",
      "sudo usermod -aG docker $${USER}",
      "sudo systemctl start docker",
      "sudo systemctl enable docker",
      "sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose",
      "sudo chmod +x /usr/local/bin/docker-compose",
      "sudo yum install -y git",
      "sudo git clone https://github.com/j-e-kroczek/Programowanie-w-chmurze.git",
      "echo 'VITE_API_URL=\"http://${self.public_ip}:3000/api\"' | sudo tee Programowanie-w-chmurze/Lista-1/frontend/.env.local",
      "echo 'VITE_SOCKET_URL=\"http://${self.public_ip}:3000\"' | sudo tee -a Programowanie-w-chmurze/Lista-1/frontend/.env.local",
      "cd Programowanie-w-chmurze/Lista-1",
      "sudo docker-compose up --detach"
    ]
  }
}

resource "aws_vpc" "server_vpc" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"
  tags = {
    Name = "Server VPC"
  }
}

resource "aws_subnet" "server_subnet" {
  vpc_id     = aws_vpc.server_vpc.id
  cidr_block = "10.0.1.0/24"
  tags = {
    Name = "Server public subnet"
  }
}

resource "aws_internet_gateway" "server_gateway" {
  vpc_id = aws_vpc.server_vpc.id
  tags = {
    Name = "Server gateway"
  }
}
resource "aws_route_table" "server_route_table" {
  vpc_id = aws_vpc.server_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.server_gateway.id
  }
}

resource "aws_route_table_association" "server_subnet_association" {
  subnet_id      = aws_subnet.server_subnet.id
  route_table_id = aws_route_table.server_route_table.id
}

resource "aws_security_group" "server_security_group" {
  name        = "Server security group"
  description = "Srver security group"
  vpc_id      = aws_vpc.server_vpc.id


  ingress {
    description      = "SSH"
    from_port        = 22
    to_port          = 22
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    description      = "frontend"
    from_port        = 8080
    to_port          = 8080
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    description      = "backend"
    from_port        = 3000
    to_port          = 3000
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

output "instance_public_ip" {
  value = aws_instance.tictactoe_server.public_ip
}