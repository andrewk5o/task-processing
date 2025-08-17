# Task Processing System

A serverless task processing system built with AWS Lambda, SQS, and DynamoDB that implements asynchronous task processing with exponential backoff retry and dead letter queue monitoring.

## Architecture

The system consists of the following components:

- **API Gateway**: RESTful API endpoints for task management
- **DynamoDB**: Task storage and status tracking
- **SQS Queue**: Main task queue for asynchronous processing
- **SQS Dead Letter Queue (DLQ)**: Stores failed tasks after max retries
- **Lambda Functions**: 
  - `taskProcessor`: Processes tasks from SQS with retry logic
  - `dlqMonitor`: Monitors DLQ and logs failed tasks to CloudWatch

## Features

- **Asynchronous Task Processing**: Tasks are queued and processed in the background
- **Exponential Backoff Retry**: Failed tasks are retried with increasing delays
- **Dead Letter Queue**: Unprocessable tasks are moved to DLQ after max retries (2)
- **DLQ Monitoring**: Automated monitoring and logging of failed tasks
- **Task Type Support**: Different task types with configurable processing logic
- **Comprehensive Logging**: Detailed CloudWatch logs for debugging and monitoring

## Task Structure

Each task contains the following fields:

- `taskId`: Unique identifier for the task
- `answer`: Task data or answer content
- `status`: Current status (Pending, COMPLETED, FAILED)
- `retries`: Number of retry attempts (0-2)
- `errorMessage`: Error details if task failed

## API Endpoints

### Create Task
```
POST /tasks
Content-Type: application/json

{
  "taskId": "unique-task-id",
  "answer": "task answer or data"
}
```

### Get All Tasks
```
GET /tasks
```

### Get Task by ID
```
GET /tasks/{taskId}
```

## Task Processing Flow

1. **Task Creation**: Task is created via API and stored in DynamoDB with "Pending" status
2. **Queue Processing**: Task message is sent to SQS queue
3. **Task Processing**: `taskProcessor` Lambda consumes messages and processes tasks
4. **Retry Logic**: Failed tasks are retried with exponential backoff (max 2 retries) - status remains "Pending" during retries
5. **DLQ Routing**: Tasks exceeding max retries are moved to DLQ
6. **Monitoring**: `dlqMonitor` Lambda runs every 5 minutes to process DLQ messages

## Retry Strategy

- **Base Delay**: 1 second
- **Exponential Backoff**: Delay doubles with each retry attempt
- **Jitter**: Random variation (±10%) to prevent thundering herd
- **Max Delay**: Capped at 30 seconds
- **Max Retries**: 2 attempts before moving to DLQ

## Environment Variables

- `TASKS_TABLE`: DynamoDB table name for task storage
- `TASKS_QUEUE_URL`: SQS main queue URL
- `TASKS_QUEUE_NAME`: SQS main queue name
- `DLQ_URL`: SQS dead letter queue URL

## Deployment

```bash
# Install dependencies
npm install

# Deploy to AWS
serverless deploy

# Deploy to specific stage
serverless deploy --stage dev
```

## Monitoring

### CloudWatch Logs

- **taskProcessor**: Task processing logs with retry information
- **dlqMonitor**: DLQ monitoring logs with failed task details

### Key Metrics

- Task processing success/failure rates
- Retry attempt counts
- DLQ message counts
- Processing latency

## Local Development

```bash
# Install dependencies
npm install

# Run locally with serverless offline
npm run dev

# Test API endpoints
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"taskId": "test-1", "answer": "test answer"}'
```

## Configuration

The system can be configured via `serverless.yml`:

- **Queue Settings**: Visibility timeout, message retention, max receive count
- **Lambda Settings**: Memory, timeout, concurrency limits
- **Monitoring**: DLQ monitor schedule (default: every 5 minutes)

## Error Handling

- **Task Failures**: Logged with detailed error information
- **Queue Errors**: Handled gracefully with CloudWatch logging
- **DynamoDB Errors**: Retried with exponential backoff
- **SQS Errors**: Logged and handled appropriately

## Security

- IAM roles with least privilege access
- Environment variable configuration
- Secure SQS message handling
- CloudWatch logging for audit trails
