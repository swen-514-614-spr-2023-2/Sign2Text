resource "aws_vpc" "asl_vpc" {
  //cidr_block = "10.0.0.0/24"
  cidr_block = "172.16.0.0/16"
}

//This gets all all availablity zones in current region
data "aws_availability_zones" "available" {
  
}

# Create var.az_count private subnets, each in a different AZ
resource "aws_subnet" "private_subnet" {
    count = var.az_count
    cidr_block = cidrsubnet(aws_vpc.asl_vpc.cidr_block, 8, count.index)
    availability_zone = data.aws_availability_zones.available.names[count.index]
    vpc_id = aws_vpc.asl_vpc.id
}

# Create var.az_count public subnets, each in a different AZ
resource "aws_subnet" "public_subnet" {
  count                   = var.az_count
  cidr_block              = cidrsubnet(aws_vpc.asl_vpc.cidr_block, 8, var.az_count + count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  vpc_id                  = aws_vpc.asl_vpc.id
  map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.asl_vpc.id
}

# Route the public subnet traffic through the IGW
resource "aws_route" "internet_access" {
  route_table_id         = aws_vpc.asl_vpc.main_route_table_id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_eip" "asl_eip" {
  count = var.az_count
  vpc = true
  depends_on = [
    aws_internet_gateway.igw
  ]
}

resource "aws_nat_gateway" "asl_natgw" {
  count  = var.az_count
  subnet_id = element(aws_subnet.public_subnet.*.id, count.index)
  allocation_id = element(aws_eip.asl_eip.*.id, count.index)
}

resource "aws_route_table" "private" {
  count = var.az_count
  vpc_id = aws_vpc.asl_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = element(aws_nat_gateway.asl_natgw.*.id, count.index)
  }
}

resource "aws_route_table_association" "private" {
  count = var.az_count
  subnet_id = element(aws_subnet.private_subnet.*.id, count.index)
  route_table_id = element(aws_route_table.private.*.id, count.index)
}


