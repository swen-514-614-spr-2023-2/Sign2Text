resource "aws_ecs_cluster" "test-cluster" {
  name = "backend-cluster"
}

data "template_file" "testapp" {
  template = file("./templates/image/image.json")

  vars = {
    app_image      = var.app_image
    app_port       = var.app_port
    fargate_cpu    = var.fargate_cpu
    fargate_memory = var.fargate_memory
    aws_region     = var.aws_region
    key_id         = var.access_key
    secret_key     = var.secret_key
    url_broker = var.BROKER_URL
    
  }
}

resource "aws_ecs_task_definition" "chatroom-task-def" {
  family                   = "some-task-def"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  container_definitions    = data.template_file.testapp.rendered
}

resource "aws_ecs_service" "test-service" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.test-cluster.id
  task_definition = aws_ecs_task_definition.chatroom-task-def.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.ecs_sg.id]
    subnets          = [aws_subnet.public.id]
    assign_public_ip = true
  }

  depends_on = [aws_iam_role_policy_attachment.ecs_task_execution_role]
}


