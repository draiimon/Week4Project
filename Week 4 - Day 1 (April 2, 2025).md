# **Week 4: End-to-End DevOps Project - Day 1 (Wednesday, April 2, 2025)**

## **Introduction**

Today marks the beginning of Week 4, our final project week. This project requires me to apply all the skills I've learned so far: containerizing an application with Docker, creating a CI/CD pipeline, and deploying to AWS. I'm excited but also a bit nervous since this is my first complete DevOps project.

My project will be called "OakTree" - a simple web application that I'll take from local development to cloud deployment. The main goal is to learn the entire process rather than building something complex.

## **What I Did Today**

### **Project Setup:**

- Created a new GitHub repository for the project
- Set up the basic folder structure:
  - `/client` for the React frontend
  - `/server` for the Node.js backend
  - `/terraform` for infrastructure code
- Added a README.md explaining what the project is about
- Created a simple .gitignore file for Node.js

### **Basic Application Setup:**

- Started with a very basic Express.js server
- Created a "Hello World" endpoint to test that everything works
- Set up `package.json` with basic dependencies
- Tested the server locally and made sure it runs on port 5000

### **Learning and Research:**

- Spent time reading Docker documentation since I'm still new to containerization
- Looked at examples of Dockerfiles for Node.js applications
- Researched the AWS services we'll be using (mainly ECR and ECS)
- Took notes on important concepts to remember

## **Code I Wrote Today**

Here's the simple Express server I created:

```javascript
// server/index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello from OakTree DevOps Project!');
});

// Health check for AWS
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

And my simple package.json:

```json
{
  "name": "oaktree-project",
  "version": "0.1.0",
  "description": "A simple DevOps project for Week 4",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js",
    "dev": "nodemon server/index.js"
  },
  "dependencies": {
    "express": "^4.17.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.15"
  }
}
```

## **Helpful Resources**

These are the resources I found most helpful today:

- [Node.js Docker Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/) - This official guide helped me understand how to containerize a Node.js app.
- [AWS ECR Documentation](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html) - I bookmarked this for when we start working with container registries.
- [AWS ECS Documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) - This will be useful when we deploy our containers.
- [Terraform Getting Started Guide](https://learn.hashicorp.com/collections/terraform/aws-get-started) - I'll use this to learn infrastructure as code.

**Take screenshots of these documentation pages for your learning documentation.**

## **Challenges I Faced**

### **Project Scope Confusion:**

- **Challenge**: I wasn't sure how complex this project should be. Should I focus on a fancy application or on the DevOps process?
  
- **Solution**: After talking with classmates, I realized that the focus should be on the DevOps pipeline itself, not on building a complex application. So I decided to keep the app simple and focus on the deployment process.

### **Docker Confusion:**

- **Challenge**: Docker concepts like layers, multi-stage builds, and volumes are still confusing to me.
  
- **Solution**: I found a beginner-friendly YouTube tutorial that explained these concepts clearly. I took notes and drew diagrams to help myself understand how Docker works.

## **What I Learned**

Today I learned that planning is really important for DevOps projects. In previous assignments, I would often start coding right away, but for this project, I need to think about the whole process from development to deployment.

I also realized that AWS has many services, and it's easy to get overwhelmed. I decided to focus on just the ones we need for this project (ECR for storing Docker images and ECS for running them).

The most helpful thing I learned was about Docker. I finally understood that:
- The Dockerfile is like a recipe for creating an image
- Images are like templates for containers
- Containers are the actual running instances

This simple mental model really helped me understand containerization better.

## **Plans for Tomorrow**

Tomorrow I plan to:

1. Create a Dockerfile for the application
   - Learn how to optimize it
   - Make sure it works with our Express app

2. Start on a simple React frontend
   - Just basic components, nothing fancy
   - Make it call our Express API

3. Learn more about AWS
   - Understand how to authenticate with AWS
   - Figure out how to push Docker images to ECR

## **Conclusion**

Day 1 was mostly about planning and setting up the basics. I didn't write a lot of code, but I think the research and setup I did today will help me work more efficiently for the rest of the week.

I'm excited to start working with Docker tomorrow and actually containerizing my application. This project is challenging but should give me great experience with real-world DevOps processes!