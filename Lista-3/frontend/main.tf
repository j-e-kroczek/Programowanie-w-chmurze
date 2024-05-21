terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws" // Definicja wymaganego dostawcy AWS
      version = "~> 4.16"   
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1"    
}

// Tworzenie klastra ECS
resource "aws_ecs_cluster" "tic-tac-toe-app" {
  name = "tic-tac-toe-app"
}


// Definicja zadania ECS dla frontendu
resource "aws_ecs_task_definition" "frontend_task" {
  family                   = "FrontendTaskDef"  // Nazwa rodziny definicji zadania
  network_mode             = "awsvpc"   // Tryb sieciowy dla kontenerów Fargate
  requires_compatibilities = ["FARGATE"]    // Zgodności wymagane dla zadania Fargate
  execution_role_arn       = "arn:aws:iam::781686230145:role/LabRole"   // ARN roli wykonawcaej
  task_role_arn            = "arn:aws:iam::781686230145:role/LabRole"   // ARN roli zadania
  cpu                      = "1024" // Limit CPU dla zadania
  memory                   = "3072" // Limit pamięci dla zadania

  container_definitions = jsonencode([  // Definicja kontenera w formacie JSON
    {
      name          = "latest"   
      image         = "781686230145.dkr.ecr.us-east-1.amazonaws.com/tic-tac-toe-frontend" // Obraz kontenera
      cpu           = 0  // Użycie CPU kontenera
      essential     = true
      portMappings  = [ // Mapowanie portów
        {
          containerPort = 8080  // Port kontenera
          hostPort      = 8080  // Port hosta
          protocol      = "tcp" // Protokół
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-create-group"   = "true"
          "awslogs-group"          = "/ecs/FrontendTaskDef"
          "awslogs-region"         = "us-east-1"
          "awslogs-stream-prefix"  = "ecs"
        }
      }
    }
  ])

  runtime_platform {        // Definiowanie platformy uruchomieniowej
    cpu_architecture        = "X86_64"
    operating_system_family = "LINUX"
  }
}

// Tworzenie grupy zabezpieczeń dla frontendu
resource "aws_security_group" "frontend_sg" {
  name        = "frontend-sg"
  description = "Allow TCP 8080 for frontend"
  vpc_id      = aws_vpc.my_vpc.id

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

// Tworzenie usługi ECS dla frontendu
resource "aws_ecs_service" "frontend_service" {
  name            = "frontend-service"
  cluster         = aws_ecs_cluster.tic-tac-toe-app.id
  task_definition = aws_ecs_task_definition.frontend_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.pub_subnet.id]
    security_groups  = [aws_security_group.frontend_sg.id]
    assign_public_ip = true
  }
}

// Tworzenie VPC
resource "aws_vpc" "my_vpc" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"
  tags = {
    Name = "MyVPC"
  }
}

// Tworzenie publicznej podsieci
resource "aws_subnet" "pub_subnet" {
  vpc_id     = aws_vpc.my_vpc.id
  cidr_block = "10.0.1.0/24"
  tags = {
    Name = "My public subnet"
  }
}

// Tworzenie internetowej bramy
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.my_vpc.id
  tags = {
    Name = "My IGW"
  }
}

// Tworzenie publicznej tablicy routingu
resource "aws_route_table" "pub_rt" {
  vpc_id = aws_vpc.my_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "pub_rt_association" {
  subnet_id      = aws_subnet.pub_subnet.id
  route_table_id = aws_route_table.pub_rt.id
}