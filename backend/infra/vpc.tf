resource "aws_vpc" "asl-backend-vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "public" {
    vpc_id = aws_vpc.asl-backend-vpc.id

    cidr_block = "10.0.0.0/17"

    depends_on = [
      aws_vpc.asl-backend-vpc
    ]
}
