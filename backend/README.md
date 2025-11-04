# Learning Platform Backend API

Backend API server for the Learning Platform application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### Health Check
- `GET /health` - Check if server is running

### Quiz Endpoints
- `POST /api/quiz/submit` - Submit a quiz answer
- `GET /api/quiz/performance/:questionId` - Get quiz performance (instructor only)
- `POST /api/quiz/trigger` - Trigger a question (instructor only)

### Clustering Endpoints
- `GET /api/clustering/session/:sessionId` - Get clusters for a session
- `POST /api/clustering/update` - Update clusters based on quiz performance
- `GET /api/clustering/student/:studentId` - Get student's cluster assignment

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=3001
NODE_ENV=development
```

## Development

The server uses TypeScript and runs with `ts-node-dev` for hot reloading.

## Production

Build the project:
```bash
npm run build
```

Start the production server:
```bash
npm start
```
