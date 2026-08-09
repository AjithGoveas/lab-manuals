---
subject: "Cloud Computing"
subjectSlug: "cloud-computing"
experimentNumber: 2
title: "Containerization using Docker"
description: "Containerize a Python Flask web application using Docker. Build local container images, manage tags, and launch isolated application stacks."
tags: ["Docker", "Containers", "Flask", "DevOps"]
dataset: "Docker Hub"
vivaQuestions:
  - question: "What is the difference between a Virtual Machine and a Container?"
    answer: "Virtual Machines package a full guest OS, hypervisor, and application, running on virtualized hardware. Containers share the host OS kernel and isolate user spaces, making them much lighter and faster."
  - question: "What is a Dockerfile?"
    answer: "A Dockerfile is a text document containing all the sequential command-line instructions needed to assemble a container image."
  - question: "What is the role of Docker Image Layers?"
    answer: "Each instruction in a Dockerfile creates a read-only layer in the image. Docker caches these layers to speed up builds and minimize storage footprint."
  - question: "Why do we use the EXPOSE instruction in Dockerfiles?"
    answer: "EXPOSE acts as documentation, specifying the ports on which the container listens at runtime. You must still publish/bind the ports using `-p` when launching the container."
metrics:
  - epoch: 1
    trainLoss: 0.00
    testAccuracy: 100.00
    note: "Docker run active"
---

# Containerization using Docker

## Aim

To write a Dockerfile for a Python Flask application, build the container image, and run it locally as an isolated container container.

## Theory

Containerization is OS-level virtualization. Unlike Virtual Machines, **Docker** container instances share the host machine's OS kernel.

Key Docker objects:
1. **Dockerfile**: Text configurations defining the recipe of base environments and dependencies.
2. **Docker Image**: A read-only template with instructions for creating a Docker container.
3. **Docker Container**: A runnable instance of an image.
4. **Port Mapping**: Binds container network interfaces to the host ports (`host_port:container_port`), allowing external access.

## Code

```dockerfile
# Step 1: Define Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

```bash
# Step 2: Build the docker image locally
docker build -t flask-app:v1 .

# Step 3: View local images
docker images

# Step 4: Run container in detached mode mapping host port 80 to container port 5000
docker run -d -p 80:5000 --name web-container flask-app:v1

# Step 5: Check container status
docker ps
```

## Expected Results

```
OUTPUT: 

Sending build context to Docker daemon  24.57kB
Step 1/7 : FROM python:3.9-slim
 ---> 7d956a0058b8
...
Successfully tagged flask-app:v1

CONTAINER ID   IMAGE          COMMAND           STATUS         PORTS
3a8f90be10cd   flask-app:v1   "python app.py"   Up 12 seconds  0.0.0.0:80->5000/tcp
```

## Conclusion

The Flask application was successfully containerized. Using Docker, we created a lightweight, self-contained system image and executed it as a container container, proving deployment portability across hosts.
