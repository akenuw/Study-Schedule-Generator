const { isWeekend } = require('date-fns');

function optimizeSchedule(schedule) {
    // Apply various optimization strategies
    const optimizedSchedule = { ...schedule };
    
    // 1. Balance subject distribution across days
    optimizedSchedule.days = balanceSubjectDistribution(optimizedSchedule.days, schedule.preferences);
    
    // 2. Apply spaced repetition principles
    optimizedSchedule.days = applySpacedRepetition(optimizedSchedule.days, schedule.preferences);
    
    // 3. Optimize session timing based on cognitive load
    optimizedSchedule.days = optimizeSessionTiming(optimizedSchedule.days, schedule.preferences);
    
    // 4. Add variety to prevent monotony
    optimizedSchedule.days = addVariety(optimizedSchedule.days, schedule.preferences);
    
    return optimizedSchedule;
}

function balanceSubjectDistribution(days, preferences) {
    const subjects = preferences.subjects;
    const studyDays = days.filter(day => day.sessions.length > 0);
    
    if (studyDays.length === 0 || subjects.length === 0) {
        return days;
    }
    
    // Calculate target sessions per subject
    const totalSessions = studyDays.reduce((total, day) => total + day.sessions.length, 0);
    const sessionsPerSubject = Math.floor(totalSessions / subjects.length);
    const extraSessions = totalSessions % subjects.length;
    
    // Track subject usage
    const subjectCount = {};
    subjects.forEach(subject => {
        subjectCount[subject] = 0;
    });
    
    // Redistribute subjects more evenly
    studyDays.forEach((day, dayIndex) => {
        day.sessions.forEach((session, sessionIndex) => {
            // Find the subject that needs more sessions
            const underUsedSubjects = subjects.filter(subject => {
                const target = sessionsPerSubject + (subjects.indexOf(subject) < extraSessions ? 1 : 0);
                return subjectCount[subject] < target;
            });
            
            if (underUsedSubjects.length > 0) {
                // Prefer subjects that haven't been used recently
                const bestSubject = findBestSubjectForSession(underUsedSubjects, day, sessionIndex, preferences);
                session.subject = bestSubject;
                subjectCount[bestSubject]++;
            } else {
                // Use round-robin for remaining sessions
                const subjectIndex = (dayIndex * day.sessions.length + sessionIndex) % subjects.length;
                session.subject = subjects[subjectIndex];
                subjectCount[subjects[subjectIndex]]++;
            }
        });
    });
    
    return days;
}

function findBestSubjectForSession(availableSubjects, day, sessionIndex, preferences) {
    // Prefer different subjects from previous session
    if (sessionIndex > 0) {
        const previousSubject = day.sessions[sessionIndex - 1].subject;
        const differentSubjects = availableSubjects.filter(s => s !== previousSubject);
        if (differentSubjects.length > 0) {
            return differentSubjects[0];
        }
    }
    
    return availableSubjects[0];
}

function applySpacedRepetition(days, preferences) {
    if (!preferences.includeReview) {
        return days;
    }
    
    const studyDays = days.filter(day => day.sessions.length > 0);
    
    // Implement spaced repetition intervals: 1 day, 3 days, 7 days
    studyDays.forEach((day, dayIndex) => {
        day.sessions.forEach((session, sessionIndex) => {
            // Add review sessions based on spaced repetition
            if (dayIndex >= 1 && sessionIndex === 0) {
                // Review yesterday's material
                session.type = 'review';
                session.topic = `Review: ${session.topic}`;
            } else if (dayIndex >= 3 && sessionIndex === 1) {
                // Review 3-day-old material
                session.type = 'review';
                session.topic = `Spaced Review: ${session.topic}`;
            } else if (dayIndex >= 7 && sessionIndex === day.sessions.length - 1) {
                // Review week-old material
                session.type = 'review';
                session.topic = `Weekly Review: ${session.topic}`;
            }
        });
    });
    
    return days;
}

function optimizeSessionTiming(days, preferences) {
    return days.map(day => {
        if (day.sessions.length === 0) return day;
        
        const optimizedSessions = [...day.sessions];
        
        // Apply cognitive load principles
        optimizedSessions.forEach((session, index) => {
            const totalSessions = optimizedSessions.length;
            
            // Morning: High cognitive load subjects
            if (index < totalSessions / 3) {
                session.cognitiveLoad = 'high';
                session.recommendation = 'Best time for challenging new material';
            }
            // Midday: Medium cognitive load
            else if (index < (2 * totalSessions) / 3) {
                session.cognitiveLoad = 'medium';
                session.recommendation = 'Good for practice and application';
            }
            // Evening: Low cognitive load, review
            else {
                session.cognitiveLoad = 'low';
                session.recommendation = 'Ideal for review and consolidation';
                if (session.type !== 'review') {
                    session.type = 'review';
                    session.topic = `Review: ${session.topic}`;
                }
            }
        });
        
        return { ...day, sessions: optimizedSessions };
    });
}

function addVariety(days, preferences) {
    const studyDays = days.filter(day => day.sessions.length > 0);
    
    // Add learning style variety
    studyDays.forEach(day => {
        day.sessions.forEach((session, index) => {
            // Rotate learning methods based on preferences
            const methods = getLearningMethods(preferences.learningStyle);
            session.method = methods[index % methods.length];
            
            // Add activity suggestions
            session.activities = generateActivities(session.subject, session.method, session.type);
        });
    });
    
    return days;
}

function getLearningMethods(learningStyle) {
    const methods = {
        'visual': ['Reading', 'Diagrams', 'Charts', 'Mind Maps', 'Flashcards'],
        'auditory': ['Listening', 'Discussion', 'Explanation', 'Audio Notes', 'Teaching Others'],
        'kinesthetic': ['Practice Problems', 'Hands-on Activities', 'Writing', 'Building', 'Experimentation'],
        'mixed': ['Reading', 'Practice', 'Discussion', 'Visual Aids', 'Writing', 'Teaching']
    };
    
    return methods[learningStyle] || methods['mixed'];
}

function generateActivities(subject, method, sessionType) {
    const activities = {
        'Reading': [`Read ${subject} textbook chapter`, `Review ${subject} notes`, `Study ${subject} reference materials`],
        'Practice': [`Solve ${subject} problems`, `Complete ${subject} exercises`, `Work on ${subject} assignments`],
        'Discussion': [`Discuss ${subject} concepts`, `Explain ${subject} to someone`, `Join ${subject} study group`],
        'Visual Aids': [`Create ${subject} mind map`, `Draw ${subject} diagrams`, `Use ${subject} flashcards`],
        'Writing': [`Write ${subject} summary`, `Take ${subject} notes`, `Create ${subject} outline`],
        'Teaching': [`Teach ${subject} concept`, `Explain ${subject} problem`, `Create ${subject} tutorial`]
    };
    
    const methodActivities = activities[method] || activities['Practice'];
    
    if (sessionType === 'review') {
        return methodActivities.map(activity => activity.replace('Read', 'Review').replace('Solve', 'Review'));
    }
    
    return methodActivities;
}

module.exports = { optimizeSchedule };
