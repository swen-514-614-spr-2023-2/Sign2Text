terraform {
    required_providers {
        aws = {
            source = "hashicorp/aws"
        }
    }
}

# Provider configuration
provider "aws" {
  region     = "us-east-1"
  }


resource "aws_eip" "kafka_elatstic_ip" {
  # count = 1 # specify the number of Elastic IPs to create
  tags = {
    Name = "kafka-ip"
  }
}

# EC2 instance resource
resource "aws_instance" "kafka_instance" {
  ami                    = "ami-0ec54bafcae1d6302"
  instance_type          = "t2.medium"
  key_name               = "for_aws_test"
  vpc_security_group_ids = [aws_security_group.kafka_security_group.id]

  # User data script to install Kafka
  user_data = <<-EOF
                #!/bin/bash
                pwd
                cd /home/ec2-user/kafka/kafka_2.13-3.4.0/
                whoami
                date
                ipdns=$(hostname -i)
                awk -F"=" '/^advertised.listeners/{$2="PLAINTEXT://'$ipdns':9092";print;next}1' config/server.properties > config/serverUpdated.properties 
                awk -F"=" '/^listeners/{$2="PLAINTEXT://'$ipdns':9092";print;next}1' config/serverUpdated.properties > config/serverUpdated2.properties              
                sudo nohup bin/zookeeper-server-start.sh config/zookeeper.properties > ~/zoo.txt 2>&1 &
                sudo nohup bin/kafka-server-start.sh config/serverUpdated2.properties > ~/server.txt 2>&1 &
                echo 'scripts complete'               
              EOF

  tags = {
    Name = "kafka-instance"
  }

  depends_on = [aws_eip.kafka_elatstic_ip]

}

#Associate EIP with Middle Wear
resource "aws_eip_association" "kafka_eip_association" {
  instance_id   = aws_instance.kafka_instance.id
  allocation_id = aws_eip.kafka_elatstic_ip.id

  depends_on = [aws_instance.kafka_instance]

}

# Security group allowing public access to Kafka
resource "aws_security_group" "kafka_security_group" {
  name_prefix = "kafka-security-group"


  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 9092
    to_port     = 9092
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
  from_port   = 0
  to_port     = 0
  protocol    = "all"
  cidr_blocks = ["0.0.0.0/0"]
}

  

  # depends_on = [aws_eip_association.kafka_eip_association]
}

# Output the public IP address of the instance
output "kafka_elatstic_ip" {
  value = aws_eip.kafka_elatstic_ip.public_ip
  # depends_on = [aws_security_group.kafka_security_group]
}


resource "aws_eip" "middleware_elatstic_ip" {
  # count = 1 # specify the number of Elastic IPs to create
  tags = {
    Name = "middleware-ip"
  }

  depends_on = [aws_security_group.kafka_security_group]

}

# EC2 instance resource
resource "aws_instance" "middleware_instance" {
  ami                    = "ami-08f8ef3166a9ce6b4"
  instance_type          = "t2.micro"
  key_name               = "for_aws_test"
  vpc_security_group_ids = [aws_security_group.middleware_security_group.id]

  # User data script to install middleware
  user_data = <<-EOF
                #!/bin/bash
                echo KAFKA_IP=${aws_eip.kafka_elatstic_ip.public_ip} >> /etc/profild.d
                echo KAFKA_IP=${aws_eip.kafka_elatstic_ip.public_ip} >> /etc/environment
                pwd
                cd /home/ec2-user/team-1/kafka-middleware
                pwd
                whoami
                date
                npm i
                nohup node server.js > /home/ec2-user/middlewareLog.txt 2>&1 &
                echo 'scripts complete'
              EOF

  tags = {
    Name = "middleware-instance"
  }

  # provisioner "remote-exec" {
  #   # depends_on = [aws_eip_association.middle_eip_association, aws_security_group.middleware_security_group]
  #   connection {
  #     type        = "ssh"
  #     user        = "ec2-user" # or "ubuntu" for Amazon Linux 2 or Ubuntu AMIs
  #     private_key = file("./free-tier.pem") # path to your SSH private key
  #     host        = aws_instance.middleware_instance.public_ip
  #   }

  #   inline = [
  #     "echo KAFKA_IP=${aws_eip.kafka_elatstic_ip.public_ip} >> /etc/environment"
        # "echo KAFKA_IP=${aws_eip.kafka_elatstic_ip.public_ip} >> /etc/profild.d"
  #     "export KAFKA_IP=${aws_eip.kafka_elatstic_ip.public_ip}"
  #   ]
  # }

depends_on = [aws_security_group.middleware_security_group]

}

#Associate EIP with Middle Wear
resource "aws_eip_association" "middle_eip_association" {
  instance_id   = aws_instance.middleware_instance.id
  allocation_id = aws_eip.middleware_elatstic_ip.id

  depends_on = [aws_instance.middleware_instance]
}

# Security group allowing public access to middleware
resource "aws_security_group" "middleware_security_group" {
  name_prefix = "middleware-security-group"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
  from_port   = 0
  to_port     = 0
  protocol    = "all"
  cidr_blocks = ["0.0.0.0/0"]
}

  

  # depends_on = [aws_eip_association.middle_eip_association]
}

# Output the public IP address of the instance
# output "middle_public_ip" {
#   value = aws_instance.middleware_instance.public_ip
# }


output "middleware_elatstic_ip" {
  value = aws_eip.middleware_elatstic_ip.public_ip
  # depends_on = [aws_security_group.middleware_security_group]
}



resource "aws_eip" "backend_elatstic_ip" {
  # count = 1 # specify the number of Elastic IPs to create
  tags = {
    Name = "backend-ip"
  }

  depends_on = [aws_security_group.kafka_security_group]

}


resource "aws_instance" "backend_instance" {
  ami                    = "ami-0e80e0059e3ea7ff5"
  instance_type          = "t2.medium"
  key_name               = "for_aws_test"
  vpc_security_group_ids = [aws_security_group.backend_security_group.id]
  # User data script to install middleware
  user_data = <<-EOF
                #!/bin/bash
                echo KAFKA_IP=${aws_eip.kafka_elatstic_ip.public_ip} >> /etc/profild.d
                echo KAFKA_IP=${aws_eip.kafka_elatstic_ip.public_ip} >> /etc/environment
                pwd
                cd /home/ec2-user/team-1/backend
                pwd
                whoami
                date
                npm i
                nohup node ChatroomAPI.js > /home/ec2-user/backendLog.txt 2>&1 &
                echo ‘scripts complete’
              EOF
  tags = {
    Name = "backend-instance"
  }


  depends_on = [aws_security_group.backend_security_group]
}

#Associate EIP with Middle Wear
resource "aws_eip_association" "backend_eip_association" {
  instance_id   = aws_instance.backend_instance.id
  allocation_id = aws_eip.backend_elatstic_ip.id

  depends_on = [aws_instance.backend_instance]
}

resource "aws_security_group" "backend_security_group" {
  name_prefix = "backend-security-group"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
  from_port   = 0
  to_port     = 0
  protocol    = "all"
  cidr_blocks = ["0.0.0.0/0"]
}
}


output "backend_elatstic_ip" {
  value = aws_eip.backend_elatstic_ip.public_ip
  # depends_on = [aws_security_group.middleware_security_group]
}

resource "aws_iam_role_policy_attachment" "s3_readonly_access" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
  role       = aws_iam_role.sagemaker_role.name
}


resource "aws_iam_role" "sagemaker_role" {
  name = "MySageMakerRole_s2t_2"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "sagemaker.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "sagemaker_policy" {
  name = "sagemaker_policy"
  role = aws_iam_role.sagemaker_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::*"
        ]
      }
    ]
  })
}


resource "aws_iam_role_policy_attachment" "sagemaker_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonSageMakerFullAccess"
  role       = aws_iam_role.sagemaker_role.name
}

resource "aws_sagemaker_model" "SageMakerModel" {
    name = "tensorflow-inference-tf"
    primary_container {
        model_data_url = "https://s2t-model-team1.s3.amazonaws.com/model.tar.gz"
        image = "763104351884.dkr.ecr.us-east-1.amazonaws.com/tensorflow-inference:2.8.0-cpu"
    }
    #replace the account id with the current one used
    # execution_role_arn = "arn:aws:iam::707043296968:role/service-role/AmazonSageMaker-ExecutionRole-20230418T094015"
    execution_role_arn = aws_iam_role.sagemaker_role.arn

    depends_on = [aws_iam_role_policy.sagemaker_policy]
}

resource "aws_sagemaker_endpoint_configuration" "SageMakerEndpointConfig" {
    name = "tensorflow-inference-tf"
    production_variants {
        variant_name = "AllTraffic"
        model_name = "tensorflow-inference-tf"
        initial_instance_count = 1
        instance_type = "ml.t2.medium"
        initial_variant_weight = 1
    }
    depends_on = [aws_sagemaker_model.SageMakerModel]
}

resource "aws_sagemaker_endpoint" "SageMakerEndpoint" {
    name = "tensorflow-inference-tf"
    endpoint_config_name = "tensorflow-inference-tf"
     depends_on = [aws_sagemaker_endpoint_configuration.SageMakerEndpointConfig]
}


# resource "aws_instance" "EC2Instance2" {
#     ami = "ami-01507a06620067e57"
#     instance_type = "t2.medium"
#     key_name = "free-tier"
#     availability_zone = "us-east-1d"
#     tenancy = "default"
#     subnet_id = "subnet-0eeccdaf441c643e3"
#     ebs_optimized = false
#     vpc_security_group_ids = [
#         "sg-0a79def0e6d57431b"
#     ]
#     source_dest_check = true
#     root_block_device {
#         volume_size = 24
#         volume_type = "gp3"
#         delete_on_termination = true
#     }
#     tags = {
#         Name = "ml_service_from_ami"
#     }
# }

resource "aws_eip" "ml_elatstic_ip" {
  # count = 1 # specify the number of Elastic IPs to create
  tags = {
    Name = "ml-ip"
  }

  depends_on = [aws_security_group.backend_security_group]

}

resource "aws_instance" "ml_instance" {
  ami                    = "ami-07c18075beeeec6f4"
  instance_type          = "t2.large"
  key_name               = "for_aws_test"
  vpc_security_group_ids = [aws_security_group.ml_security_group.id]
  # User data script to install middleware add keys at placeholders
  user_data = <<-EOF
                #!/bin/bash
                pwd
                echo BACKEND_IP=${aws_eip.backend_elatstic_ip.public_ip} >> /etc/profild.d
                echo BACKEND_IP=${aws_eip.backend_elatstic_ip.public_ip} >> /etc/environment
                cd /home/ec2-user/team-1/ml_image_service
                pwd
                whoami
                date
                aws configure set aws_access_key_id <access_key_here>
                aws configure set aws_secret_access_key <secret_key_here>
                aws configure set region us-east-1
                source /home/ec2-user/anaconda3/bin/activate s2tpy
                nohup python3 app.py > /home/ec2-user/mlLog.txt 2>&1 &
                echo ‘scripts complete’
              EOF
  tags = {
    Name = "ml-instance"
  }

  depends_on = [aws_security_group.ml_security_group]

}


resource "aws_eip_association" "ml_eip_association" {
  instance_id   = aws_instance.ml_instance.id
  allocation_id = aws_eip.ml_elatstic_ip.id

  depends_on = [aws_instance.ml_instance]
}

resource "aws_security_group" "ml_security_group" {
  name_prefix = "ml-security-group"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
  from_port   = 0
  to_port     = 0
  protocol    = "all"
  cidr_blocks = ["0.0.0.0/0"]
}
}

output "ml_elatstic_ip" {
  value = aws_eip.ml_elatstic_ip.public_ip
}






######################################



