const { addDays, format, startOfDay } = require('date-fns');
const { optimizeSchedule } = require('./scheduleOptimizer');
const { calculateBreaks, distributeSubjects } = require('./utils');

function generateSchedule(preferences) {
    const schedule = {
        preferences,
        days: [],
        summary: {
            totalStudyTime: 0,
            totalSessions: 0,
            subjects: preferences.subjects
        }
    };

    // Generate schedule for the specified number of days
    for (let i = 0; i < preferences.scheduleDays; i++) {
        const currentDate = addDays(new Date(), i);
        const dayName = format(currentDate, 'EEEE');
        
        // Check if this day is available for study
        if (!preferences.availableDays.includes(dayName)) {
            schedule.days.push({
                date: format(currentDate, 'yyyy-MM-dd'),
                dayName,
                sessions: []
            });
            continue;
        }

        const daySchedule = generateDaySchedule(preferences, currentDate, i);
        schedule.days.push(daySchedule);
        
        // Update summary
        schedule.summary.totalStudyTime += daySchedule.sessions.reduce(
            (total, session) => total + session.duration, 0
        );
        schedule.summary.totalSessions += daySchedule.sessions.length;
    }

    // Optimize the schedule
    return optimizeSchedule(schedule);
}

function generateDaySchedule(preferences, date, dayIndex) {
    const dayName = format(date, 'EEEE');
    const sessions = [];
    
    // Calculate total study time for the day in minutes
    const totalDailyMinutes = preferences.dailyStudyTime * 60;
    const sessionDuration = preferences.studyDuration;
    const breakDuration = preferences.breakDuration;
    
    // Calculate number of sessions for the day
    const numberOfSessions = Math.floor(totalDailyMinutes / (sessionDuration + breakDuration));
    
    if (numberOfSessions === 0) {
        return {
            date: format(date, 'yyyy-MM-dd'),
            dayName,
            sessions: []
        };
    }

    // Distribute subjects across sessions
    const subjectDistribution = distributeSubjects(preferences.subjects, numberOfSessions);
    
    // Generate sessions with optimal timing
    let currentTime = getOptimalStartTime(preferences, dayName);
    
    for (let i = 0; i < numberOfSessions; i++) {
        const subject = subjectDistribution[i % subjectDistribution.length];
        const sessionType = determineSessionType(preferences, dayIndex, i);
        
        const session = {
            startTime: formatTime(currentTime),
            endTime: formatTime(addMinutes(currentTime, sessionDuration)),
            duration: sessionDuration,
            subject: subject,
            topic: generateTopicSuggestion(subject, sessionType, preferences),
            type: sessionType,
            difficulty: getSessionDifficulty(preferences, i, numberOfSessions)
        };

        // Add break information
        if (i < numberOfSessions - 1) {
            session.break = {
                duration: breakDuration,
                type: getBreakType(i, numberOfSessions)
            };
        }

        sessions.push(session);
        
        // Move to next session time (including break)
        currentTime = addMinutes(currentTime, sessionDuration + breakDuration);
    }

    return {
        date: format(date, 'yyyy-MM-dd'),
        dayName,
        sessions
    };
}

function determineSessionType(preferences, dayIndex, sessionIndex) {
    // Implement spaced repetition logic
    if (!preferences.includeReview) {
        return 'study';
    }
    
    // Review sessions on specific patterns
    if (dayIndex > 0 && sessionIndex === 0) {
        return 'review'; // Start each day with review
    }
    
    if (dayIndex % 3 === 0 && sessionIndex % 2 === 1) {
        return 'review'; // Regular review sessions
    }
    
    return 'study';
}

function generateTopicSuggestion(subject, sessionType, preferences) {
    const topicSuggestions = {
        'Mathematics': ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Problem Solving'],
        'Science': ['Physics', 'Chemistry', 'Biology', 'Lab Work', 'Theory Review'],
        'History': ['Ancient History', 'Modern History', 'World Wars', 'Cultural Studies', 'Timeline Review'],
        'Literature': ['Poetry', 'Novels', 'Essays', 'Literary Analysis', 'Writing Practice'],
        'Programming': ['Algorithms', 'Data Structures', 'Coding Practice', 'Project Work', 'Debugging'],
        'Languages': ['Vocabulary', 'Grammar', 'Conversation', 'Reading', 'Writing'],
        'Art': ['Drawing', 'Painting', 'Art History', 'Techniques', 'Portfolio Work'],
        'Music': ['Theory', 'Practice', 'Composition', 'Listening', 'Performance']
    };
    
    const topics = topicSuggestions[subject] || ['Study Session', 'Practice', 'Review', 'Exercises'];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    if (sessionType === 'review') {
        return `Review: ${randomTopic}`;
    }
    
    return randomTopic;
}

function getOptimalStartTime(preferences, dayName) {
    // Default optimal study times based on research
    const optimalTimes = {
        'Monday': { hour: 9, minute: 0 },
        'Tuesday': { hour: 9, minute: 0 },
        'Wednesday': { hour: 9, minute: 0 },
        'Thursday': { hour: 9, minute: 0 },
        'Friday': { hour: 9, minute: 0 },
        'Saturday': { hour: 10, minute: 0 },
        'Sunday': { hour: 10, minute: 0 }
    };
    
    return optimalTimes[dayName] || { hour: 9, minute: 0 };
}

function getSessionDifficulty(preferences, sessionIndex, totalSessions) {
    // Start with easier topics, increase difficulty mid-session, end with review
    if (sessionIndex === 0) return 'easy';
    if (sessionIndex === totalSessions - 1) return 'review';
    if (sessionIndex <= totalSessions / 2) return 'medium';
    return 'hard';
}

function getBreakType(sessionIndex, totalSessions) {
    if (sessionIndex === Math.floor(totalSessions / 2)) {
        return 'long'; // Longer break in the middle
    }
    return 'short';
}

function addMinutes(time, minutes) {
    const totalMinutes = time.hour * 60 + time.minute + minutes;
    return {
        hour: Math.floor(totalMinutes / 60) % 24,
        minute: totalMinutes % 60
    };
}

function formatTime(time) {
    const hour = time.hour.toString().padStart(2, '0');
    const minute = time.minute.toString().padStart(2, '0');
    return `${hour}:${minute}`;
}

module.exports = { generateSchedule };
