resource "aws_alb" "alb" {
  name = "my-load-balancer"
  subnets = aws_subnet.public_subnet.*.id
  security_groups = [aws_security_group.alb-sg.id]
}

resource "aws_alb_target_group" "first-tg" {
  name        = "first-tg"
  port        = var.first_service_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.asl_vpc.id

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 3
    protocol            = "HTTP"
    matcher             = "200"
    path                = var.health_check_path
    interval            = 30
  }

} 

resource "aws_alb_target_group" "second-tg" {
  name = "second-tg"
  port = var.second_service_port
  protocol = "HTTP"
  target_type = "ip"
  vpc_id = aws_vpc.asl_vpc.id

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 3
    protocol            = "HTTP"
    matcher             = "200"
    path                = var.health_check_path
    interval            = 30
  }
}

resource "aws_alb_listener" "first-listener" {
  load_balancer_arn = aws_alb.alb.id
  port = var.first_service_port
  protocol = "HTTP"

  default_action {
    type = "forward"
    target_group_arn = aws_alb_target_group.first-tg.arn
  }
}

resource "aws_alb_listener" "second-listener" {
  load_balancer_arn = aws_alb.alb.id
  port = var.second_service_port
  protocol = "HTTP"

  default_action {
    type = "forward"
    target_group_arn = aws_alb_target_group.second-tg.arn
  }
}
