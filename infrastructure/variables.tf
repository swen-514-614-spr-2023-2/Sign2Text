variable "aws_region" {
    default = "us-east-1"
    description = "region where our resources are being created"
}

variable "az_count" {
  default     = "2"
  description = "number of availability zones in above region"
}

variable "ecs_task_execution_role" {
  default     = "myECcsTaskExecutionRole"
  description = "ECS task execution role name"
}

variable "first_service_image" {
    default = "ppatwekar/three-thousand"
    description = "image from docker for chatroom service"
}

variable "second_service_image" {
  default = "ppatwekar/five-thousand"
  description = "image from docker for chatroom service"
}

variable "first_service_port" {
  default = "3000"
  description = "portexposed on the first service docker image"
}

variable "second_service_port"{
  default = "5000"
  description = "portexposed on the second service docker image"
}

variable "first_container_name" {
  default = "3000_container"
}

variable "second_container_name" {
  default = "5000_container"
}

variable "app_count" {
    default = "2"
  description = "numer of docker containers to run"
}

variable "health_check_path" {
  default = "/"
}

variable "fargate_cpu" {
  default     = "1024"
  description = "fargate instacne CPU units to provision,my requirent 1 vcpu so gave 1024"
}

variable "fargate_memory" {
  default     = "2048"
  description = "Fargate instance memory to provision (in MiB) not MB"
}