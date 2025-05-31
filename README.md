# Study Schedule Generator - Web Application

A modern web application that creates personalized study schedules based on your learning preferences, available time, and cognitive science principles. Built with React frontend and Node.js/Express backend.

## Features

- 🎯 **Personalized Scheduling**: Creates schedules based on your subjects, time availability, and learning style
- 🧠 **Spaced Repetition**: Implements scientifically-proven spaced repetition for better retention
- ⏰ **Optimal Timing**: Schedules difficult subjects during peak cognitive hours
- 📊 **Multiple Learning Styles**: Supports visual, auditory, kinesthetic, and mixed learning approaches
- 💾 **Data Persistence**: Saves your preferences and schedules for future use
- 📈 **Schedule Optimization**: Balances subjects and prevents study monotony
- 📋 **Export Options**: Export schedules to CSV for external calendar apps

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone or download this repository**
2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Quick setup (alternative):**
   ```bash
   npm run setup
   ```

## Usage

### Web Application (Recommended)

1. **Start the backend server:**
   ```bash
   npm start
   ```

2. **In a new terminal, start the React development server:**
   ```bash
   npm run client:dev
   ```

3. **Or run both simultaneously:**
   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**
   - Web App: http://localhost:3000 (React dev server)
   - API: http://localhost:3001 (Backend server)

### Command Line Interface (Legacy)

For the original CLI experience:

```bash
npm run cli
```

## Configuration Options

### Study Preferences

- **Name**: Your name for personalized schedules
- **Subjects**: Choose from predefined subjects or add custom ones
- **Session Duration**: 25, 45, 60, 90 minutes, or custom
- **Break Duration**: 5, 10, 15, or 20 minutes
- **Available Days**: Select which days you can study
- **Daily Study Time**: Hours per day you want to dedicate to studying
- **Learning Style**: Visual, Auditory, Kinesthetic, or Mixed
- **Difficulty Level**: Beginner, Intermediate, Advanced, or Mixed
- **Spaced Repetition**: Enable/disable review sessions
- **Schedule Duration**: Number of days to plan ahead (1-30)

### Learning Styles

- **Visual**: Reading, diagrams, charts, mind maps, flashcards
- **Auditory**: Listening, discussion, explanation, audio notes
- **Kinesthetic**: Practice problems, hands-on activities, writing
- **Mixed**: Combination of all approaches for variety

## Algorithm Features

### Spaced Repetition
- Review sessions scheduled at optimal intervals (1 day, 3 days, 7 days)
- Prevents forgetting curve and improves long-term retention

### Cognitive Load Optimization
- **Morning**: High cognitive load subjects (new, challenging material)
- **Midday**: Medium cognitive load (practice and application)
- **Evening**: Low cognitive load (review and consolidation)

### Subject Distribution
- Balanced distribution across available study days
- Prevents subject clustering and maintains variety
- Intelligent subject rotation to avoid monotony

### Break Optimization
- Short breaks (5-15 min) between regular sessions
- Long breaks (20-30 min) at midpoint of study periods
- Break suggestions based on duration and time of day

## Architecture

### Backend (Node.js/Express)
- **RESTful API** for schedule generation and data management
- **Reuses existing algorithms** from the CLI version
- **CORS enabled** for frontend communication
- **Data persistence** with JSON files

### Frontend (React)
- **Modern Material-UI components** for responsive design
- **Interactive forms** for preference collection
- **Real-time schedule generation** and display
- **Export functionality** for calendar integration

## File Structure

```
study-schedule-generator/
├── package.json             # Root project configuration
├── README.md               # This file
├── index.js                # CLI entry point (legacy)
├── server/
│   └── index.js            # Express server and API routes
├── src/                    # Shared core logic
│   ├── userInput.js        # User preference collection (CLI)
│   ├── scheduleGenerator.js # Core scheduling algorithm
│   ├── scheduleOptimizer.js # Schedule optimization logic
│   ├── dataManager.js      # Data persistence and export
│   └── utils.js            # Utility functions
├── client/                 # React frontend
│   ├── package.json        # Frontend dependencies
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── components/     # React components
│   │   │   ├── HomePage.js
│   │   │   ├── ScheduleForm.js
│   │   │   ├── ScheduleDisplay.js
│   │   │   └── ScheduleHistory.js
│   │   └── services/
│   │       └── api.js      # API service layer
│   └── build/              # Production build output
├── data/                   # Generated data directory
│   ├── preferences.json    # Saved user preferences
│   ├── schedules/          # Saved schedule files
│   └── latest-schedule-summary.txt # Quick reference
├── test/                   # Test files
└── examples/               # Example usage and demos
```

## API Endpoints

### Core Endpoints
- `GET /api/health` - Health check
- `POST /api/schedule/generate` - Generate new schedule
- `POST /api/schedule/export` - Export schedule to CSV
- `GET /api/preferences` - Load saved preferences
- `POST /api/preferences` - Save user preferences
- `GET /api/schedules` - List saved schedules
- `POST /api/tips` - Get study tips

### Example API Usage

```javascript
// Generate a schedule
const response = await fetch('/api/schedule/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Student Name',
    subjects: ['Mathematics', 'Science'],
    studyDuration: 60,
    breakDuration: 15,
    availableDays: ['Monday', 'Tuesday', 'Wednesday'],
    dailyStudyTime: 3,
    learningStyle: 'mixed',
    difficulty: 'intermediate',
    includeReview: true,
    scheduleDays: 7
  })
});

const data = await response.json();
console.log(data.schedule, data.stats, data.tips);
```

## Data Storage

- **Preferences**: Saved in `data/preferences.json`
- **Schedules**: Saved in `data/schedules/` with timestamps
- **Summary**: Quick text summary in `data/latest-schedule-summary.txt`
- **Export**: CSV exports saved in `data/` directory

## Example Output

```
📅 Your Personalized Study Schedule

2024-01-15 (Monday)
------------------------------
  09:00 - 10:30 (90 min)
    Mathematics - Algebra
    📝 Study session
    ☕ 15 min break after

  10:45 - 12:15 (90 min)
    Science - Physics
    📝 Study session
    ☕ 30 min break after

  12:45 - 14:15 (90 min)
    Programming - Algorithms
    📝 Review session

📊 Schedule Summary
--------------------
Total study time: 270 minutes
Number of sessions: 3
Subjects covered: Mathematics, Science, Programming
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Web Application Features

### 🎨 Modern User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Material-UI Components**: Professional and accessible interface
- **Interactive Forms**: Real-time validation and user feedback
- **Dark/Light Theme**: Automatic theme detection (coming soon)

### 📱 User Experience
- **Step-by-Step Wizard**: Guided schedule creation process
- **Live Preview**: See schedule updates in real-time
- **Export Options**: Download schedules as CSV for calendar apps
- **History Management**: View and manage previously created schedules

### 🔧 Technical Features
- **RESTful API**: Clean separation between frontend and backend
- **Real-time Updates**: Instant schedule generation and display
- **Error Handling**: Comprehensive error messages and recovery
- **Performance Optimized**: Fast loading and responsive interactions

## Deployment

### Production Build

1. **Build the React frontend:**
   ```bash
   npm run client:build
   ```

2. **Start the production server:**
   ```bash
   NODE_ENV=production npm start
   ```

3. **The app will be available at:** http://localhost:3001

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=production
PORT=3001
REACT_APP_API_URL=http://localhost:3001/api
```

### Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run client:build
EXPOSE 3001
CMD ["npm", "start"]
```

## Future Enhancements

### Completed ✅
- [x] Web interface for easier interaction
- [x] Modern React frontend with Material-UI
- [x] RESTful API backend
- [x] Real-time schedule generation
- [x] Export functionality

### Planned 🚀
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Progress tracking and analytics
- [ ] Study goal setting and achievement tracking
- [ ] Collaborative study scheduling
- [ ] Mobile app version (React Native)
- [ ] AI-powered difficulty adjustment
- [ ] Integration with learning management systems
- [ ] Push notifications for study reminders
- [ ] Study session timer with Pomodoro technique
- [ ] Performance analytics and insights

## Support

For issues, questions, or feature requests, please create an issue in the repository.
