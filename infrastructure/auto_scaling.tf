resource "aws_appautoscaling_target" "ecs_target-first" {
  max_capacity       = 4
  min_capacity       = 2
  resource_id        = "service/${aws_ecs_cluster.my_cluster.name}/${aws_ecs_service.first-service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_target" "ecs_target-second" {
  max_capacity       = 4
  min_capacity       = 2
  resource_id        = "service/${aws_ecs_cluster.my_cluster.name}/${aws_ecs_service.second-service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "ecs_policy_up-1" {
    name = "scale-down"
    policy_type = "StepScaling"
    resource_id = "service/${aws_ecs_cluster.my_cluster.name}/${aws_ecs_service.first-service.name}"
    scalable_dimension = aws_appautoscaling_target.ecs_target-first.scalable_dimension
    service_namespace  = aws_appautoscaling_target.ecs_target-first.service_namespace

    step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Maximum"

    step_adjustment {
      metric_interval_upper_bound = 0
      scaling_adjustment          = -1
    }
  }

}

resource "aws_appautoscaling_policy" "ecs_policy_up-2" {
    name = "scale-down"
    policy_type = "StepScaling"
    resource_id = "service/${aws_ecs_cluster.my_cluster.name}/${aws_ecs_service.second-service.name}"
    scalable_dimension = aws_appautoscaling_target.ecs_target-second.scalable_dimension
    service_namespace  = aws_appautoscaling_target.ecs_target-second.service_namespace

    step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Maximum"

    step_adjustment {
      metric_interval_upper_bound = 0
      scaling_adjustment          = -1
    }
  }

}
