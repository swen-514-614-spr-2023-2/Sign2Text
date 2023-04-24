# Provider configuration
provider "aws" {
  region     = "us-east-1"
  access_key = "ASIA33LCU34PR6G3NJ4G"
  secret_key = "ESfHhTnOwEbrvpuOwsT1aROAgKTvtzsARI0eK6wE"
  token      = "FwoGZXIvYXdzEPH//////////wEaDLgcNo+4aD/IweU4+CK/ATDElKRtNXkb4Yf68zx6MxFPZfcEHvblsEKLCTupSdKGE4Oy3RQ2P1E2ROJLQ4xfIewIhB8Skpmcb8SFxblMtPLHUsquW9CVMJDsdAO2x/aUocxl5Fk1Z7fCXUwj3ODcpFdpDkczj5muhKHIFP9kbG1cK1ao9JZrNvp+Wn3dGGdq3lJWKxFETexpMU8bsBs5/RxFJR0hIq0P/SNSwnxi6ENGZwXvhf5SeFHziu4Ojhsxu/pUqmdK/2zUxgjFp4m0KPCTlaIGMi38/Pw01CWEfo8b+qGpk50nXutExk1GPdelSz7+8I4I1MRptkfUsyTp76ta9Ko="
}

resource "aws_eip" "middleware-elatstic-ip" {
  # count = 1 # specify the number of Elastic IPs to create

  tags = {
    Name = "middleware-ip"
  }
}

# EC2 instance resource
resource "aws_instance" "middleware_instance" {
  ami                    = "ami-08e435171cf5a3f7c"
  instance_type          = "t2.micro"
  key_name               = "Sumit_AWS_Academy_Key"
  vpc_security_group_ids = [aws_security_group.middleware_security_group.id]

  # User data script to install middleware
  user_data = <<-EOF
                #!/bin/bash
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
}

#Associate EIP with EC2 Instance
resource "aws_eip_association" "demo-eip-association" {
  instance_id   = aws_instance.middleware_instance.id
  allocation_id = aws_eip.middleware-elatstic-ip.id
}

# Security group allowing public access to middleware
resource "aws_security_group" "middleware_security_group" {
  name_prefix = "middleware-security-group"

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
}

# Output the public IP address of the instance
output "public_ip" {
  value = aws_instance.middleware_instance.public_ip
}


output "elastic_ip" {
  value = aws_eip.middleware-elatstic-ip.public_ip
}
