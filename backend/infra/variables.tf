variable "BROKER_URL" {
  default = "44.215.244.102:9092"
}

variable "access_key" {
  default = ""
}

variable "secret_key" {
  default = ""
}

variable "app_image" {
  default     = "ppatwekar/chatroom-microservice"
  description = "docker image to run in this ECS cluster"
}

variable "app_port" {
  default     = "80"
}

variable "fargate_cpu" {
  default     = "1024"
  description = "fargate instacne CPU units to provision,my requirent 1 vcpu so gave 1024"
}

variable "fargate_memory" {
  default     = "2048"
  description = "Fargate instance memory to provision (in MiB) not MB"
}

variable "aws_region" {
  default     = "us-east-1"
}

variable "ecs_task_execution_role" {
  default     = "myECcsTaskExecutionRole"
  description = "ECS task execution role name"
}