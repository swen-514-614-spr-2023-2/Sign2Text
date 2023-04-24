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
  key_name               = "free-tier"
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
  ami                    = "ami-08e435171cf5a3f7c"
  instance_type          = "t2.micro"
  key_name               = "free-tier"
  vpc_security_group_ids = [aws_security_group.middleware_security_group.id]

  # User data script to install middleware
  user_data = <<-EOF
                #!/bin/bash
                echo KAFKA_IP=${aws_eip.kafka_elatstic_ip.public_ip} >> /etc/profild.d
                echo KAFKA_IP=${aws_eip.kafka_elatstic_ip.public_ip} >> /etc/environment
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
  ami                    = "ami-01ea1c781f5c171d4"
  instance_type          = "t2.medium"
  key_name               = "free-tier"
  vpc_security_group_ids = [aws_security_group.backend_security_group.id]
  # User data script to install middleware
  user_data = <<-EOF
                #!/bin/bash
                pwd
                cd /home/ec2-user/team-1/backend
                pwd
                whoami
                date
                npm i
                nohup node ChatroomAPI.js > /home/ec2-user/backendLog.txt 2>&1 &
                echo KAFKA_IP=${aws_eip.kafka_elatstic_ip.public_ip} >> /etc/profild.d
                echo KAFKA_IP=${aws_eip.kafka_elatstic_ip.public_ip} >> /etc/environment
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
}


output "backend_elatstic_ip" {
  value = aws_eip.backend_elatstic_ip.public_ip
  # depends_on = [aws_security_group.middleware_security_group]
}







######################################



