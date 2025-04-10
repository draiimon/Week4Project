# OakTree DevOps Project - Week 4 Final Implementation

This repository contains the Week 4 final implementation of the OakTree DevOps project, featuring AWS integration, containerization, and cross-environment support.

## Features

- **AWS DynamoDB Integration**: User authentication and data storage
- **Local PostgreSQL Fallback**: Graceful degradation when AWS is unavailable
- **Cross-Environment Support**: Runs on Linux, Windows WSL, and Docker
- **Modern UI**: React frontend with TailwindCSS and shadcn/ui
- **Secure Authentication**: Passport.js with password hashing
- **Complete CI/CD Pipeline**: GitHub Actions workflow for build, test, and deploy

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)
- PostgreSQL (for local development)
- Docker (optional, for containerized deployment)
- AWS Account with DynamoDB access (optional)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/draiimon/Oaktree.git
   cd Oaktree
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory with:
   ```
   DATABASE_URL=postgresql://[username]:[password]@localhost:5432/oaktree
   # Optional AWS configuration
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=your_region
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open your browser and navigate to http://localhost:5000

### Running in Windows WSL

1. Follow the same steps as Local Development Setup
2. Ensure PostgreSQL is installed and running in your WSL environment
3. Make sure to update your `.env` file with the correct DATABASE_URL for your WSL PostgreSQL instance
4. Run the application using `npm run dev`

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t oaktree-app:latest .
   ```

2. **Run the container**
   ```bash
   docker run -d -p 5000:5000 \
     -e DATABASE_URL=postgresql://[username]:[password]@host.docker.internal:5432/oaktree \
     -e AWS_ACCESS_KEY_ID=your_access_key \
     -e AWS_SECRET_ACCESS_KEY=your_secret_key \
     -e AWS_REGION=your_region \
     --name oaktree-container \
     oaktree-app:latest
   ```

3. **Access the application**
   Open your browser and navigate to http://localhost:5000

## AWS Integration

This application integrates with AWS DynamoDB for user authentication and data storage. If AWS credentials are not provided, the application will automatically fall back to using the local PostgreSQL database.

### Setting Up AWS DynamoDB

1. Create a DynamoDB table named `OakTreeUsers` with primary key `username` (String)
2. Configure your AWS credentials in the `.env` file
3. The application will automatically connect to DynamoDB when available

## Project Structure

```
.
├── .github/workflows    # CI/CD pipeline configurations
├── client/             # React frontend
│   ├── src/            # Source code
│   ├── public/         # Static assets
│   └── ...
├── server/             # Express backend
│   ├── auth.ts         # Authentication logic
│   ├── aws-db.ts       # AWS DynamoDB integration
│   ├── db.ts           # PostgreSQL database connection
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Data storage interface
│   └── ...
├── shared/             # Shared types and utilities
├── .dockerignore       # Docker ignore file
├── .env.example        # Example environment variables
├── Dockerfile          # Docker configuration
├── package.json        # Dependencies and scripts
└── README.md           # Project documentation
```

## CI/CD Pipeline

This project includes a GitHub Actions workflow for continuous integration and deployment:

1. **Build and Test**: Runs on every push and pull request
2. **Docker Build**: Creates and pushes a Docker image to Docker Hub
3. **Deployment**: Automatically deploys to production from the main branch

## License

This project is licensed under the MIT License - see the LICENSE file for details.