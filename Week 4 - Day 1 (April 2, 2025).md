# **Week 4: End-to-End DevOps Project - Day 1 (Wednesday, April 2, 2025)**

## **Introduction**

Today marks the beginning of Week 4, where I'll be working on the final project that consolidates all the skills learned in the first three weeks. This project is focused on creating a complete DevOps pipeline for a web application, including containerization, CI/CD setup, infrastructure as code, and cloud deployment.

After reviewing the project requirements, I understand that I need to build a system that demonstrates my ability to:
1. Containerize an application
2. Set up automated CI/CD pipeline
3. Provision cloud infrastructure using IaC
4. Deploy containers to the cloud

The application I've decided to build is called "OakTree" - a cloud infrastructure monitoring and management platform that I'll develop throughout this week.

## **What I Did Today**

### **Project Planning:**

- Read through the project requirements and created a detailed plan
- Researched similar applications to understand best practices
- Created a simple project roadmap with key milestones:
  - Day 1-2: Application setup and containerization
  - Day 3-4: Infrastructure as Code with Terraform
  - Day 5-6: CI/CD pipeline setup
  - Day 7-8: Cloud deployment and testing
- Drafted a basic architecture diagram using draw.io

### **Learning Resources Setup:**

- Collected and organized documentation for technologies I'll be using
- Bookmarked key AWS service documentation pages
- Set up a project notebook to track my progress and document learnings
- Created a list of potential challenges and solutions based on previous weeks' projects

### **Environment Setup:**

- Created new GitHub repository for the project
- Set up basic project directory structure
- Initialized git repository and created initial commit
- Configured .gitignore file for Node.js project

### **Application Initialization:**

- Started with a basic Node.js Express application structure
- Set up package.json with initial dependencies
- Created simple "Hello World" endpoint to verify the setup works
- Added basic error handling middleware
- Tested local server using Node.js

This basic setup gives me a foundation to build upon for the rest of the week.

## **Code Snippets**

Here's the basic Express server I created today:

```javascript
// server/index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to OakTree - DevOps Project');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

And here's my initial package.json:

```json
{
  "name": "oaktree-devops",
  "version": "0.1.0",
  "description": "OakTree DevOps Project - Week 4 Final Project",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js",
    "dev": "nodemon server/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^4.17.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.15"
  }
}
```

## **Learning About Docker**

Most of my time today was spent researching containerization with Docker, since that's the first part of the project. I found several key resources that were very helpful:

- Docker's official documentation on containerizing Node.js applications
- YouTube tutorials on multi-stage Docker builds
- Blog posts about Docker best practices for production applications

I took notes on key Docker concepts that I'll need to implement tomorrow:

1. Dockerfile structure and commands
2. Multi-stage builds for optimizing image size
3. Docker layer caching for faster builds
4. Container security best practices
5. Environment variable handling in containers

## **AWS Service Research**

I spent some time understanding which AWS services would be most appropriate for my project:

1. **ECR (Elastic Container Registry)** - For storing Docker images
2. **ECS (Elastic Container Service)** - For running containerized applications
3. **VPC (Virtual Private Cloud)** - For network isolation
4. **IAM (Identity and Access Management)** - For secure access control
5. **CloudWatch** - For monitoring and logging

I focused on reading the documentation for these services to better understand how they would fit into my project.

## **Resources**

### **Docker Documentation:**
- [Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/) - Official Node.js guide
- [Docker multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/) - For optimizing container size
- [Docker best practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/) - General guidelines

### **AWS Documentation:**
- [Amazon ECR User Guide](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html) - For understanding container registry
- [Amazon ECS Developer Guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) - For container orchestration
- [AWS IAM Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) - For security configuration

### **Terraform Resources:**
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs) - For IaC implementation
- [Terraform Best Practices](https://www.terraform-best-practices.com/) - Community guidelines

## **Challenges & Solutions**

### **Project Scope Management:**

- **Challenge**: The project requirements are quite broad, making it difficult to determine how much depth to go into for each component.
  
- **Solution**: I decided to create a phased approach, focusing first on getting a basic working deployment pipeline before adding more advanced features. This will ensure I have a functional end-to-end solution before enhancing specific areas.

### **Technology Selection:**

- **Challenge**: There are multiple ways to deploy containerized applications in AWS (ECS, EKS, App Runner, etc.).
  
- **Solution**: After research, I selected ECS with Fargate as the best balance of simplicity and features for this project. This allows me to focus on the DevOps pipeline rather than cluster management.

## **Learning Insights**

Today I learned about the importance of planning in DevOps projects. In previous weeks, I often jumped straight into coding without a clear plan, which led to rework later. By spending today creating a roadmap and researching the technologies, I feel more confident about the direction of the project.

I also gained a better understanding of the different AWS container services and their tradeoffs. For example, while EKS (Elastic Kubernetes Service) offers more flexibility for complex applications, ECS is simpler to set up and integrate with other AWS services, making it a better choice for this project's scope and timeline.

The most valuable insight was about Docker multi-stage builds. In previous projects, my Docker images were unnecessarily large because I included build tools in the final image. By learning about multi-stage builds, I now understand how to create much smaller and more secure production images.

## **Future Plans**

For tomorrow, I plan to:

1. Create a Dockerfile for the application
   - Implement multi-stage build for optimization
   - Set up proper NODE_ENV configuration
   - Add health check configuration

2. Begin setting up a basic frontend
   - Create simple React application
   - Set up routing and basic components
   - Configure build process

3. Learn more about AWS authentication
   - Research IAM roles and policies
   - Understand security best practices for deployment
   - Set up local AWS credentials for development

4. Start exploring Terraform basics
   - Install Terraform CLI
   - Learn about basic Terraform syntax
   - Understand AWS provider configuration

## **Conclusion**

Day 1 of Week 4 was primarily focused on planning and research, which I believe will pay off in more efficient development in the coming days. I've set up a basic project structure and created a roadmap that will guide my work throughout the week.

While I didn't write a lot of code today, the research and planning I've done have given me a clearer understanding of the requirements and challenges ahead. I'm excited to start implementing the Docker containerization tomorrow and begin building out the application.

This project represents an opportunity to bring together everything I've learned in the previous weeks, and I'm looking forward to creating a complete DevOps pipeline from development to production.