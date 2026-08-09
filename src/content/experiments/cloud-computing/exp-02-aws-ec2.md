---
subject: "Cloud Computing"
subjectSlug: "cloud-computing"
experimentNumber: 2
title: "Creating and Configuring an Amazon EC2 Instance"
description: "A detailed manual on provisioning an Amazon EC2 virtual server, configuring security firewalls, and hosting a custom website using Nginx."
tags: ["AWS", "EC2", "Virtualization", "Nginx"]
dataset: "AWS Cloud"
notebookUrl: ""
vivaQuestions:
  - question: "What is an AMI in Amazon EC2?"
    answer: "An Amazon Machine Image (AMI) is a pre-configured template containing the operating system, application server, and applications needed to launch an instance."
  - question: "Explain the difference between t2.micro and other instance families."
    answer: "The 't' family provides burstable performance, ideal for workloads that don't need high CPU consistently (like test servers). '2' represents the generation, and 'micro' defines the allocation of virtual CPUs (1 vCPU) and memory (1 GiB)."
  - question: "What does the SSH chmod 400 command accomplish?"
    answer: "It restricts read permissions to the owner of the private key file and revokes all other permissions. SSH clients reject keys that are accessible by others to maintain secure authentication standards."
  - question: "Why do we use Nginx over Apache for hosting websites?"
    answer: "Nginx is built on an asynchronous, event-driven architecture, enabling it to handle a large number of concurrent connections with low memory consumption compared to Apache's process-per-connection model."
  - question: "How do Security Group rules control port accessibility?"
    answer: "Security groups are stateful firewalls. We configure Inbound rules (e.g. TCP Port 80 for HTTP, TCP Port 22 for SSH) to allow traffic from specific IP sources. Outbound traffic is generally fully permitted by default."
metrics:
  - epoch: 1
    trainLoss: 0.0000
    testAccuracy: 100.00
    note: "Instance online & Nginx active"
---

# Creating and Configuring an Amazon EC2 Instance

## Aim

To launch, configure, and connect to an Amazon EC2 Linux virtual server instance, and host a custom HTML web page using Nginx.

## Theory

Amazon Elastic Compute Cloud (EC2) provides secure, resizable virtual machines in the AWS cloud. Nginx is a high-performance web server, reverse proxy, and load balancer.

### AWS EC2 Setting Categories

When launching an EC2 instance, the following settings must be configured:

1. **Amazon Machine Image (AMI)**: Selects the base operating system (e.g. Amazon Linux 2023, Ubuntu).
2. **Instance Type**: Allocates CPU, memory, and storage configurations (e.g., `t2.micro` provides 1 vCPU and 1 GiB RAM).
3. **Key Pair (Login)**: A public/private cryptographic key pair used for passwordless, secure SSH authentication.
4. **Network Settings**:
   - **VPC / Subnet**: Determines the virtual network and availability zone.
   - **Auto-assign Public IP**: Assigns a reachable IP address from the internet.
   - **Firewall (Security Groups)**: Rules defining allowed inbound traffic ports (SSH: 22, HTTP: 80, HTTPS: 443).
5. **Configure Storage**: Specifies Elastic Block Store (EBS) root volume size (e.g., 8 GiB GP3).

---

## Step-by-Step Procedure

### Step 1: Logging into the AWS Management Console
1. Navigate to the AWS Console homepage at `https://aws.amazon.com/console/`.
2. Click **Sign In to the Console** at the top right.
3. Choose either **Root User** or **IAM User**, enter your credentials, and submit the multi-factor authentication (MFA) if enabled.

### Step 2: Accessing the EC2 Dashboard
1. Locate the **Services** menu in the top-left navigation bar.
2. Under **Compute**, select **EC2** to open the EC2 Dashboard.
3. Click the orange **Launch Instance** dropdown button and select **Launch instance**.

### Step 3: Configuring the EC2 Launch Parameters
Configure the instance using the following parameters:

* **Name and tags**: Give the instance a descriptive name (e.g., `Lab-Web-Server`).
* **Application and OS Images (AMI)**: Choose **Amazon Linux** (specifically *Amazon Linux 2023 AMI*, which is Free Tier eligible).
* **Instance Type**: Select `t2.micro` (1 vCPU, 1 GiB RAM, Free Tier eligible).
* **Key Pair (login)**: 
  - Click **Create new key pair**.
  - Set the name to `lab-key`, select **RSA**, and set the private key file format to `.pem` (for OpenSSH).
  - Click **Create key pair** to download the `lab-key.pem` file. Save this file securely.
* **Network Settings**:
  - Click **Edit** next to Network Settings.
  - Leave **VPC** and **Subnet** at default values.
  - Set **Auto-assign Public IP** to **Enable**.
  - Under **Firewall (security groups)**, select **Create security group**. Name it `web-server-sg`.
  - Add the following **Inbound Security Group Rules**:
    1. **Rule 1 (SSH)**: Type `SSH`, Port `22`, Source `Anywhere-IPv4 (0.0.0.0/0)` (or restrict to your IP for production).
    2. **Rule 2 (HTTP)**: Type `HTTP`, Port `80`, Source `Anywhere-IPv4 (0.0.0.0/0)`.
* **Configure Storage**: Leave the default root volume settings at **1x 8 GiB gp3** SSD storage.
* **Launch**: Review the configuration summary on the right sidebar and click **Launch instance**.

### Step 4: Connecting to the Instance via SSH
1. Wait until the instance state changes from *Pending* to *Running* on the EC2 Instances page.
2. Select the instance to locate its **Public IPv4 address** (e.g., `54.210.45.90`).
3. Open your terminal (or PowerShell on Windows) and run:

```bash
# 1. Restrict permissions of the downloaded private key (required for Linux/macOS)
chmod 400 lab-key.pem

# 2. Connect to the EC2 instance using the EC2 default username (ec2-user)
ssh -i "lab-key.pem" ec2-user@54.210.45.90
```

### Step 5: Deploying and Configuring Nginx Web Server
Once connected inside the EC2 command line shell, execute the following commands:

```bash
# 1. Update the packages repository list
sudo dnf update -y

# 2. Install Nginx web server
sudo dnf install nginx -y

# 3. Start the Nginx service and configure it to start automatically on system boot
sudo systemctl start nginx
sudo systemctl enable nginx

# 4. Navigate to Nginx html folder and create a custom webpage index
sudo rm /usr/share/nginx/html/index.html
echo "<h1>Welcome to AWS Cloud - Hosted via Nginx on EC2</h1>" | sudo tee /usr/share/nginx/html/index.html

# 5. Restart Nginx to load configuration changes
sudo systemctl restart nginx
```

---

## Expected Results

Verify the Nginx configuration:
```bash
curl http://localhost
```
Output:
```
<h1>Welcome to AWS Cloud - Hosted via Nginx on EC2</h1>
```

You can now open a web browser and navigate to the public IP of your EC2 instance (`http://54.210.45.90`) to see the operational website.

## Conclusion

The virtual server was successfully provisioned on AWS EC2, configured with custom firewall exceptions for port 80, and successfully served web pages via Nginx, proving elastic cloud compute accessibility.
