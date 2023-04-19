# Provider configuration
provider "aws" {
  region     = "us-east-1"
  access_key = "AKIA4SQM2XPY5YWNPKVZ"
  secret_key = "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"
}

# EC2 instance resource
resource "aws_instance" "kafka_instance" {
  ami                    = "ami-0e25127aa582ee971"
  instance_type          = "t2.medium"
  key_name               = "real key"
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
                nohup bin/zookeeper-server-start.sh config/zookeeper.properties > /dev/zoo.txt 2>&1 &
                nohup bin/kafka-server-start.sh config/serverUpdated.properties > /dev/server.txt 2>&1 &
                echo 'scripts complete'               
              
              EOF

  tags = {
    Name = "kafka-instance"
  }
}

# Security group allowing public access to Kafka
resource "aws_security_group" "kafka_security_group" {
  name_prefix = "kafka-security-group"

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
}

# Output the public IP address of the instance
output "public_ip" {
  value = aws_instance.kafka_instance.public_ip
}
