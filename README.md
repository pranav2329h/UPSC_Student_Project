# UPSC Current Affairs Static Linker AI

An intelligent UPSC preparation dashboard that converts daily news into structured knowledge using AI.

## Features
- **Smart News Feed**: Curated news with AI analysis buttons.
- **AI Analysis Engine**: Powered by Google Gemini to link news to UPSC Static syllabus.
- **Premium UI**: Modern dark/light mode, glassmorphism, and Framer Motion animations.
- **Knowledge Graph**: Interactive visualization of News -> Subjects -> Topics.
- **UPSC Content**: Static linked concepts, Prelims MCQs, and Mains questions generated per news article.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion, Recharts, Lucide React.
- **Backend**: Python Flask, Google Gemini API.
- **Database**: Firebase Firestore (Ready for integration).

## Setup Instructions

### Backend
1. Go to `backend` folder.
2. Initialize virtual environment: `python -m venv venv`.
3. Activate it: `.\venv\Scripts\activate`.
4. Install dependencies: `pip install -r requirements.txt`.
5. Create a `.env` file with your keys:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   GNEWS_API_KEY=your_gnews_api_key
   ```
6. Run the server: `python app.py`.

### Frontend
1. Go to `frontend` folder.
2. Install dependencies: `npm install`.
3. Create a `.env` file:
   ```
   VITE_BACKEND_URL=http://127.0.0.1:5000
   ```
4. Run the app: `npm run dev`.

## Project Structure
- `/frontend`: React application.
- `/backend`: Flask API and Gemini logic.
- `/public`: Static assets including the logo.