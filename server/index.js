const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import our existing modules
const { generateSchedule } = require('../src/scheduleGenerator');
const { calculateStudyStats, validateSchedulePreferences, generateStudyTips } = require('../src/utils');
const { saveSchedule, loadUserPreferences, saveUserPreferences, listSchedules, exportScheduleToCSV } = require('../src/dataManager');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// API Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Study Schedule Generator API is running',
        version: '2.0.0',
        timestamp: new Date().toISOString()
    });
});

// Generate schedule
app.post('/api/schedule/generate', async (req, res) => {
    try {
        const preferences = req.body;
        
        // Validate preferences
        const validationErrors = validateSchedulePreferences(preferences);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                error: 'Invalid preferences',
                details: validationErrors
            });
        }
        
        // Generate schedule
        const schedule = generateSchedule(preferences);
        
        // Calculate statistics
        const stats = calculateStudyStats(schedule);
        
        // Generate study tips
        const tips = generateStudyTips(preferences);
        
        // Save schedule and preferences
        await saveSchedule(schedule, preferences);
        
        res.json({
            success: true,
            schedule,
            stats,
            tips,
            message: 'Schedule generated successfully'
        });
        
    } catch (error) {
        console.error('Error generating schedule:', error);
        res.status(500).json({
            error: 'Failed to generate schedule',
            message: error.message
        });
    }
});

// Save user preferences
app.post('/api/preferences', async (req, res) => {
    try {
        const preferences = req.body;
        
        // Validate preferences
        const validationErrors = validateSchedulePreferences(preferences);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                error: 'Invalid preferences',
                details: validationErrors
            });
        }
        
        await saveUserPreferences(preferences);
        
        res.json({
            success: true,
            message: 'Preferences saved successfully'
        });
        
    } catch (error) {
        console.error('Error saving preferences:', error);
        res.status(500).json({
            error: 'Failed to save preferences',
            message: error.message
        });
    }
});

// Load user preferences
app.get('/api/preferences', async (req, res) => {
    try {
        const preferences = await loadUserPreferences();
        
        if (preferences) {
            res.json({
                success: true,
                preferences
            });
        } else {
            res.json({
                success: true,
                preferences: null,
                message: 'No saved preferences found'
            });
        }
        
    } catch (error) {
        console.error('Error loading preferences:', error);
        res.status(500).json({
            error: 'Failed to load preferences',
            message: error.message
        });
    }
});

// List saved schedules
app.get('/api/schedules', async (req, res) => {
    try {
        const schedules = await listSchedules();
        
        res.json({
            success: true,
            schedules: schedules.map(s => ({
                filename: s.filename,
                createdAt: s.schedule.metadata?.createdAt,
                studentName: s.schedule.metadata?.preferences?.name,
                subjects: s.schedule.metadata?.preferences?.subjects,
                totalSessions: s.schedule.summary?.totalSessions,
                totalStudyTime: s.schedule.summary?.totalStudyTime
            }))
        });
        
    } catch (error) {
        console.error('Error listing schedules:', error);
        res.status(500).json({
            error: 'Failed to list schedules',
            message: error.message
        });
    }
});

// Export schedule to CSV
app.post('/api/schedule/export', async (req, res) => {
    try {
        const { schedule, filename } = req.body;
        
        if (!schedule) {
            return res.status(400).json({
                error: 'Schedule data is required'
            });
        }
        
        const csvFilename = filename || `schedule-export-${Date.now()}.csv`;
        await exportScheduleToCSV(schedule, csvFilename);
        
        res.json({
            success: true,
            filename: csvFilename,
            message: 'Schedule exported successfully'
        });
        
    } catch (error) {
        console.error('Error exporting schedule:', error);
        res.status(500).json({
            error: 'Failed to export schedule',
            message: error.message
        });
    }
});

// Get study tips
app.post('/api/tips', (req, res) => {
    try {
        const preferences = req.body;
        const tips = generateStudyTips(preferences);
        
        res.json({
            success: true,
            tips
        });
        
    } catch (error) {
        console.error('Error generating tips:', error);
        res.status(500).json({
            error: 'Failed to generate tips',
            message: error.message
        });
    }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Study Schedule Generator server running on port ${PORT}`);
    console.log(`📱 Web app: http://localhost:${PORT}`);
    console.log(`🔧 API: http://localhost:${PORT}/api/health`);
});

module.exports = app;
