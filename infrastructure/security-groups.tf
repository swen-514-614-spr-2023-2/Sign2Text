# ALB Security Group: Edit to restrict access to the application

resource "aws_security_group" "alb-sg" {
  name = "aslapp-load-balancer-security-group"
  description = "controls access to application load balancer"
  vpc_id = aws_vpc.asl_vpc.id

  ingress {
    protocol = "tcp"
    from_port = var.first_service_port
    to_port = var.first_service_port
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol = "tcp"
    from_port = var.second_service_port
    to_port = var.second_service_port
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol = "-1"
    from_port = 0
    to_port = 0
    cidr_blocks = ["0.0.0.0/0"]

  }
}

# this security group for ecs - Traffic to the ECS cluster should only come from the ALB
resource "aws_security_group" "ecs_sg" {
  name        = "aslapp-ecs-tasks-security-group"
  description = "allow inbound access from the ALB only"
  vpc_id = aws_vpc.asl_vpc.id

  ingress {
    protocol = "tcp"
    from_port = var.first_service_port
    to_port = var.first_service_port
    security_groups = [aws_security_group.alb-sg.id]
  }

  ingress {
    protocol = "tcp"
    from_port = var.second_service_port
    to_port = var.second_service_port
    security_groups = [aws_security_group.alb-sg.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
  
}