# Teacher Sahayak

An AI-powered teaching assistant platform designed to help teachers create educational content and manage multi-grade classrooms.

## Project Structure

### Core Components

- **`src/agents/`** - Main AI agents and backend services
- **`src/portal/`** - Web frontend application
- **`docs/`** - Project documentation and presentations

## Features

### AI Agents
- **Lesson Planner** - Creates comprehensive lesson plans
- **Content Creation** - Generates educational materials and worksheets
- **Interactive Activities** - Develops engaging classroom activities
- **Visual Learning** - Creates charts, diagrams, and visual aids

### Web Portal
- Modern Next.js application with TypeScript
- User-friendly interface for teachers
- Dashboard for managing content and activities

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

### Installation

1. **Backend Setup**
   ```bash
   cd src/agents
   pip install -r requirements.txt
   python main.py
   ```

2. **Frontend Setup**
   ```bash
   cd src/portal
   npm install
   npm run dev
   ```

## Tech Stack

- **Backend**: Python, Flask/FastAPI
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **AI**: Google Gemini/Vertex AI
- **Database**: SQLite (sessions.db)

## License

See LICENSE file for details.