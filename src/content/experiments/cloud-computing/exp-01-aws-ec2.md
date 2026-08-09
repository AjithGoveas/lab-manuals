---
subject: "Cloud Computing"
subjectSlug: "cloud-computing"
experimentNumber: 1
title: "Virtual Machine Provisioning on Cloud Platforms"
description: "Provision, configure, and connect to an Amazon EC2 Linux instance. Configure Security Groups and host a standard Apache Web Server."
tags: ["AWS", "EC2", "Virtualization", "Apache"]
dataset: "AWS Cloud"
vivaQuestions:
  - question: "What is Amazon EC2?"
    answer: "Amazon Elastic Compute Cloud (EC2) is a web service that provides secure, resizable compute capacity in the cloud. It allows users to launch virtual servers (instances) on demand."
  - question: "What is the purpose of a Security Group in AWS?"
    answer: "A security group acts as a virtual firewall for your EC2 instances to control incoming and outgoing traffic. By default, it blocks all inbound traffic except what you explicitly allow."
  - question: "Why do we use SSH Key Pairs to connect to EC2?"
    answer: "SSH Key Pairs use public-key cryptography to authenticate your login securely instead of using standard password credentials, preventing brute-force attacks on the instance."
  - question: "How does Elastic IP differ from a Public IP?"
    answer: "A Public IP address is dynamic and changes every time the instance is stopped and restarted. An Elastic IP is a static, reserved Public IP address that stays allocated to your account until released."
metrics:
  - epoch: 1
    trainLoss: 0.00
    testAccuracy: 100.00
    note: "Instance successfully running"
---

# Virtual Machine Provisioning on Cloud Platforms

## Aim

To launch, configure, and connect to an Amazon EC2 Linux instance, configure security groups to allow HTTP/SSH traffic, and host an Apache Web Server.

## Theory

Cloud virtualization enables compute resources to be provisioned on-demand. **Amazon EC2** abstracts physical hardware into virtual servers using Hypervisors.

When deploying an EC2 instance, several key network components must be configured:
1. **Amazon Machine Image (AMI)**: A template containing the OS, application server, and applications.
2. **Instance Types**: Varies in CPU, memory, storage, and network capacity (e.g. `t2.micro`).
3. **Security Groups**: Acts as a stateful virtual firewall controlling inbound and outbound ports.
4. **Key Pairs**: Cryptographic keys used for secure SSH authentication (`chmod 400 private_key.pem`).

Once running, we can log in and install a standard **Apache (httpd)** service, which listens on Port 80, serving static web assets to public clients.

## Code

```bash
# Step 1: Change permissions of your private key file so it's not publicly viewable
chmod 400 my-ec2-key.pem

# Step 2: Connect to the instance using public DNS/IP address
ssh -i "my-ec2-key.pem" ec2-user@ec2-54-210-45-90.compute-1.amazonaws.com

# Step 3: Update package manager index
sudo yum update -y

# Step 4: Install Apache Web Server
sudo yum install httpd -y

# Step 5: Start httpd service and enable it to start on boot
sudo systemctl start httpd
sudo systemctl enable httpd

# Step 6: Create a simple landing page
echo "<h1>AWS EC2 Web Server Operational</h1>" | sudo tee /var/www/html/index.html
```

## Expected Results

```
OUTPUT: 

Loaded plugins: extras_suggestions, priorities, update-motd
Resolving Dependencies
--> Running transaction check
---> Package httpd.x86_64 0:2.4.52-1.amzn2 will be installed
...
Complete!

Created symlink from /etc/systemd/system/multi-user.target.wants/httpd.service to /usr/lib/systemd/system/httpd.service.
ActiveState: active (running) since Sun 2026-08-09 15:10:45 UTC; 10s ago
```

## Conclusion

The EC2 Linux instance was successfully provisioned on AWS. By modifying the Security Group's inbound rules to allow Port 80 and launching the Apache service, the virtual server served HTTP pages, demonstrating cloud compute accessibility.
