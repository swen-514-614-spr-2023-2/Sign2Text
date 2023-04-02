resource "aws_ecs_cluster" "my_cluster" {
  name = "myapp-cluster"
}

data "template_file" "first-ms" {
    template = file("./templates/image/image.json")

    vars = {
        service_image = var.first_service_image
        fargate_cpu = var.fargate_cpu
        fargate_memory = var.fargate_memory
        aws_region = var.aws_region
        service_port = var.first_service_port
        name = var.first_container_name
    }
}

data "template_file" "second-ms" {
    template = file("./templates/image/image.json")

    vars = {
        service_image = var.second_service_image
        fargate_cpu = var.fargate_cpu
        fargate_memory = var.fargate_memory
        aws_region = var.aws_region
        service_port = var.second_service_port
        name = var.second_container_name
    }
}

resource "aws_ecs_task_definition" "first-task-def" {
  family = "aslapp-task"
  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  network_mode = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu = var.fargate_cpu
  memory = var.fargate_memory
  container_definitions    = data.template_file.first-ms.rendered
}

resource "aws_ecs_task_definition" "second-task-def" {
  family = "aslapp-task" //kept it same
  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  network_mode = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu = var.fargate_cpu
  memory = var.fargate_memory
  container_definitions    = data.template_file.second-ms.rendered
}

resource "aws_ecs_service" "first-service" {
  name = "asl-firstservice"
  cluster = aws_ecs_cluster.my_cluster.id
  task_definition = aws_ecs_task_definition.first-task-def.arn
  desired_count = var.app_count
  launch_type = "FARGATE"

  network_configuration {
    security_groups = [aws_security_group.ecs_sg.id]
    subnets = aws_subnet.private_subnet.*.id
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.first-tg.arn
    container_name = var.first_container_name
    container_port = var.first_service_port
  }

  depends_on = [
    aws_alb_listener.first-listener,
    aws_iam_role_policy_attachment.ecs_task_execution_role
  ]
    
}

resource "aws_ecs_service" "second-service" {
  name = "asl-secondservice"
  cluster = aws_ecs_cluster.my_cluster.id
  task_definition = aws_ecs_task_definition.second-task-def.arn
  desired_count = var.app_count
  launch_type = "FARGATE"

  network_configuration {
    security_groups = [aws_security_group.ecs_sg.id]
    subnets = aws_subnet.private_subnet.*.id
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.first-tg.arn
    container_name = var.second_container_name
    container_port = var.second_service_port
  }

  depends_on = [
    aws_alb_listener.second-listener,
    aws_iam_role_policy_attachment.ecs_task_execution_role
  ]

}