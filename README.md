# Brain Tumor Detection System

A full-stack application for detecting brain tumors from medical images using machine learning.

![Brain Tumor Detection](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Features

- **Image Upload**: Upload brain MRI scans for analysis
- **Real-time Detection**: Get instant tumor detection results
- **User-friendly Interface**: Clean and intuitive React-based frontend
- **RESTful API**: Scalable Python backend
- **Docker Support**: Easy deployment with Docker Compose

## 🛠️ Tech Stack

### Frontend
- React.js
- TypeScript
- Tailwind CSS
- Vite

### Backend
- Python
- FastAPI/Flask (TBD)
- PDM (Python Development Master)

### Infrastructure
- Docker
- Docker Compose

## 📦 Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)
- Node.js (v16+)
- Python (v3.9+)
- PDM (for backend development)

## 🚀 Getting Started

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/brain-tumor-detection.git
   cd brain-tumor-detection
   ```
   
2. Access the application at `http://localhost:3000`

### Manual Setup

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pdm install
   ```

3. Start the backend server:
   ```bash
   pdm run start
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```
brain-tumor-detection/
├── backend/           # Backend API server
│   ├── src/           # Source code
│   ├── tests/         # Backend tests
│   └── pyproject.toml # Python dependencies
├── frontend/          # Frontend React application
│   ├── src/           # React components
│   └── public/        # Static files
└── docker-compose.yml # Docker configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Awesome AI/ML Libraries]
- [Medical Imaging Datasets]
- [Open Source Community]

