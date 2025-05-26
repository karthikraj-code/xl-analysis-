# Excel Analytics Platform

A full-stack MERN application for analyzing Excel data with interactive visualizations.

## Features

- Excel file upload and parsing
- Interactive 2D/3D data visualization
- User authentication and authorization
- Dynamic chart generation
- Chart export functionality
- Admin dashboard
- AI-powered data insights (optional)

## Tech Stack

### Frontend
- React.js
- Redux Toolkit
- Tailwind CSS
- Chart.js
- Three.js

### Backend
- Node.js
- Express.js
- MongoDB
- Multer
- SheetJS (xlsx)
- JWT Authentication

## Project Structure

```
excel-analytics-platform/
├── client/                 # Frontend React application
├── server/                 # Backend Node.js application
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd excel-analytics-platform
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd ../client
npm install
```

4. Create a .env file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
```

5. Start the development servers

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm start
```

## API Documentation

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile

### Excel Files
- POST /api/files/upload - Upload Excel file
- GET /api/files - Get user's upload history
- GET /api/files/:id - Get specific file data

### Analytics
- GET /api/analytics/summary - Get data summary
- POST /api/analytics/chart - Generate chart data

## License

MIT 