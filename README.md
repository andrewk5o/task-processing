# Task Processing Service

A serverless task processing system built with AWS Lambda, DynamoDB, SQS, and WebSocket support for real-time task status updates.

## 🏗️ Architecture Overview

The system follows an event-driven, serverless architecture pattern with the following components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │───▶│   Lambda API    │───▶│   DynamoDB      │
│   (HTTP/WS)     │    │   Function      │    │   (Tasks Table) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       ▼
         │              ┌─────────────────┐    ┌─────────────────┐
         │              │   SQS Queue     │    │ DynamoDB Streams│
         │              │  (Task Queue)   │    │                 │
         │              └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ WebSocket       │    │ Task Processor  │    │ Stream Processor│
│ Handler         │    │ Lambda          │    │ Lambda          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Connections     │    │ DLQ Monitor     │    │ Real-time       │
│ Table           │    │ Lambda          │    │ Updates         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Core Components

- **API Gateway**: HTTP API for task CRUD operations and WebSocket API for real-time updates
- **Lambda Functions**: Serverless compute for API handling, task processing, and monitoring
- **DynamoDB**: Primary data store with streams for real-time event processing
- **SQS**: Message queue for asynchronous task processing with dead letter queue
- **WebSocket**: Real-time communication for task status updates

## 🚀 Backend Setup

### Prerequisites

- Node.js 20.x or higher
- AWS CLI configured with appropriate credentials
- Serverless Framework CLI
- Docker (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-processing/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Serverless Framework globally**
   ```bash
   npm install -g serverless
   ```

4. **Configure AWS credentials**
   ```bash
   aws configure
   # Enter your AWS Access Key ID, Secret Access Key, and default region
   ```

### Deployment

1. **Deploy to development stage**
   ```bash
   serverless deploy --stage dev
   ```

2. **Deploy to production stage**
   ```bash
   serverless deploy --stage prod
   ```

3. **Deploy specific function**
   ```bash
   serverless deploy function --function api
   ```

### Local Development

1. **Start serverless development environment**
   ```bash
   serverless dev
   ```

This will start all Lambda functions locally with mocked AWS services, allowing you to test the API endpoints and WebSocket connections without deploying to AWS.


## 🔧 API Endpoints

### HTTP API

- `GET /tasks` - Retrieve all tasks
- `POST /tasks` - Create a new task

### WebSocket

Real-time communication for task status updates and client notifications.

## 📊 Monitoring and Observability

### CloudWatch Logs

All Lambda functions log to CloudWatch with structured logging for easy debugging.

### DLQ Monitoring

The `dlqMonitor` function runs every 5 minutes to check for failed tasks and provides alerts.

### DynamoDB Streams

Real-time processing of database changes for immediate task status updates.

## 🚨 Assumptions and Challenges

### Assumptions

1. **Task Processing**: Tasks are assumed to be idempotent and can be retried safely
2. **Message Ordering**: SQS FIFO ordering is not required for task processing
3. **Data Consistency**: Eventual consistency is acceptable for task status updates
4. **Scale**: The system is designed for moderate to high throughput workloads

### Challenges Faced

1. **Error Handling**: Implementing robust error handling for failed task processing with retry mechanisms
2. **WebSocket Management**: Managing WebSocket connections and ensuring real-time updates reach all connected clients
3. **DynamoDB Streams**: Handling stream processing failures and ensuring no events are lost
4. **Dead Letter Queue**: Monitoring and processing failed messages without creating infinite loops
5. **Cold Starts**: Lambda cold starts can impact response times for infrequently used functions

### Solutions Implemented

1. **Retry Logic**: Tasks are retried up to 3 times before being moved to DLQ
2. **Connection Tracking**: WebSocket connections are stored in DynamoDB for persistence
3. **Stream Processing**: DynamoDB streams are processed with error handling and logging
4. **DLQ Monitoring**: Automated monitoring of failed messages with alerting capabilities
5. **Provisioned Concurrency**: Consider using provisioned concurrency for critical functions

## 🔒 Security Considerations

- IAM roles are scoped to minimum required permissions
- DynamoDB tables use on-demand billing to prevent cost overruns
- API Gateway provides built-in DDoS protection
- WebSocket connections are validated and tracked

## 📈 Performance Optimization

- SQS batch processing for efficient message handling
- DynamoDB streams for real-time updates without polling
- Lambda function optimization for cold start reduction


## 🚀 Future Enhancements

1. **Frontend Application**: React/Vue.js application for task management
2. **Advanced Monitoring**: CloudWatch dashboards and custom metrics
3. **Multi-region Deployment**: Active-active deployment across regions
4. **Advanced Task Types**: Support for complex workflow orchestration
5. **User Authentication**: JWT-based authentication and authorization


