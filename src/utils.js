function distributeSubjects(subjects, numberOfSessions) {
    if (subjects.length === 0) return [];
    if (numberOfSessions === 0) return [];
    
    const distribution = [];
    
    // If we have more sessions than subjects, repeat subjects
    if (numberOfSessions >= subjects.length) {
        const repetitions = Math.floor(numberOfSessions / subjects.length);
        const remainder = numberOfSessions % subjects.length;
        
        // Add each subject the calculated number of times
        for (let i = 0; i < repetitions; i++) {
            distribution.push(...subjects);
        }
        
        // Add remaining subjects
        for (let i = 0; i < remainder; i++) {
            distribution.push(subjects[i]);
        }
    } else {
        // If we have fewer sessions than subjects, select a subset
        distribution.push(...subjects.slice(0, numberOfSessions));
    }
    
    // Shuffle to avoid predictable patterns
    return shuffleArray(distribution);
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function calculateBreaks(sessionDuration, totalSessions) {
    const breaks = [];
    
    for (let i = 0; i < totalSessions - 1; i++) {
        let breakDuration;
        
        // Longer breaks after longer sessions or at midpoint
        if (sessionDuration >= 90) {
            breakDuration = 20;
        } else if (sessionDuration >= 60) {
            breakDuration = 15;
        } else if (sessionDuration >= 45) {
            breakDuration = 10;
        } else {
            breakDuration = 5;
        }
        
        // Longer break at midpoint
        if (i === Math.floor(totalSessions / 2)) {
            breakDuration = Math.max(breakDuration * 2, 30);
        }
        
        breaks.push({
            duration: breakDuration,
            type: breakDuration >= 20 ? 'long' : 'short',
            suggestions: getBreakSuggestions(breakDuration)
        });
    }
    
    return breaks;
}

function getBreakSuggestions(duration) {
    if (duration >= 20) {
        return [
            'Take a walk outside',
            'Do some light stretching',
            'Have a healthy snack',
            'Practice deep breathing',
            'Listen to music',
            'Chat with friends/family'
        ];
    } else {
        return [
            'Stand up and stretch',
            'Look away from screen (20-20-20 rule)',
            'Drink water',
            'Take deep breaths',
            'Do quick exercises'
        ];
    }
}

function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes} minutes`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`;
}

function calculateStudyStats(schedule) {
    const stats = {
        totalStudyTime: 0,
        totalBreakTime: 0,
        totalSessions: 0,
        subjectBreakdown: {},
        averageSessionLength: 0,
        studyDays: 0
    };
    
    schedule.days.forEach(day => {
        if (day.sessions.length > 0) {
            stats.studyDays++;
            
            day.sessions.forEach(session => {
                stats.totalStudyTime += session.duration;
                stats.totalSessions++;
                
                // Track subject breakdown
                if (!stats.subjectBreakdown[session.subject]) {
                    stats.subjectBreakdown[session.subject] = {
                        sessions: 0,
                        totalTime: 0
                    };
                }
                stats.subjectBreakdown[session.subject].sessions++;
                stats.subjectBreakdown[session.subject].totalTime += session.duration;
                
                // Add break time
                if (session.break) {
                    stats.totalBreakTime += session.break.duration;
                }
            });
        }
    });
    
    stats.averageSessionLength = stats.totalSessions > 0 ? 
        Math.round(stats.totalStudyTime / stats.totalSessions) : 0;
    
    return stats;
}

function validateSchedulePreferences(preferences) {
    const errors = [];
    
    if (!preferences.name || preferences.name.trim().length === 0) {
        errors.push('Name is required');
    }
    
    if (!preferences.subjects || preferences.subjects.length === 0) {
        errors.push('At least one subject is required');
    }
    
    if (!preferences.studyDuration || preferences.studyDuration <= 0) {
        errors.push('Study duration must be greater than 0');
    }
    
    if (!preferences.dailyStudyTime || preferences.dailyStudyTime <= 0) {
        errors.push('Daily study time must be greater than 0');
    }
    
    if (!preferences.availableDays || preferences.availableDays.length === 0) {
        errors.push('At least one available day is required');
    }
    
    if (!preferences.scheduleDays || preferences.scheduleDays <= 0) {
        errors.push('Schedule days must be greater than 0');
    }
    
    return errors;
}

function generateStudyTips(preferences) {
    const tips = [];
    
    // Learning style specific tips
    switch (preferences.learningStyle) {
        case 'visual':
            tips.push('Use colorful notes and diagrams to enhance memory');
            tips.push('Create mind maps for complex topics');
            tips.push('Use flashcards with visual cues');
            break;
        case 'auditory':
            tips.push('Read your notes aloud while studying');
            tips.push('Discuss topics with study partners');
            tips.push('Use audio recordings for review');
            break;
        case 'kinesthetic':
            tips.push('Take notes by hand instead of typing');
            tips.push('Use physical objects or models when possible');
            tips.push('Take short movement breaks between sessions');
            break;
        default:
            tips.push('Combine different learning methods for best results');
            tips.push('Experiment with various study techniques');
    }
    
    // General study tips
    tips.push('Stay hydrated and maintain good posture');
    tips.push('Use the Pomodoro Technique for better focus');
    tips.push('Review material before sleeping for better retention');
    tips.push('Test yourself regularly instead of just re-reading');
    
    return tips;
}

module.exports = {
    distributeSubjects,
    shuffleArray,
    calculateBreaks,
    getBreakSuggestions,
    formatDuration,
    calculateStudyStats,
    validateSchedulePreferences,
    generateStudyTips
};
