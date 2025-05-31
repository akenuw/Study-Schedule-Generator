const { generateSchedule } = require('../src/scheduleGenerator');
const { calculateStudyStats, generateStudyTips } = require('../src/utils');
const chalk = require('chalk');

// Example preferences for different types of students
const examples = {
    highSchoolStudent: {
        name: 'Alex Johnson',
        subjects: ['Mathematics', 'Science', 'History', 'Literature'],
        studyDuration: 45,
        breakDuration: 10,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dailyStudyTime: 2.5,
        learningStyle: 'visual',
        difficulty: 'intermediate',
        includeReview: true,
        scheduleDays: 7
    },
    
    collegeStudent: {
        name: 'Sarah Chen',
        subjects: ['Programming', 'Mathematics', 'Science', 'Languages'],
        studyDuration: 90,
        breakDuration: 20,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday'],
        dailyStudyTime: 4,
        learningStyle: 'kinesthetic',
        difficulty: 'advanced',
        includeReview: true,
        scheduleDays: 14
    },
    
    workingProfessional: {
        name: 'Mike Rodriguez',
        subjects: ['Programming', 'Business', 'Languages'],
        studyDuration: 60,
        breakDuration: 15,
        availableDays: ['Saturday', 'Sunday'],
        dailyStudyTime: 6,
        learningStyle: 'mixed',
        difficulty: 'beginner',
        includeReview: false,
        scheduleDays: 7
    }
};

function runDemo(studentType = 'highSchoolStudent') {
    console.log(chalk.blue.bold('\n📚 Study Schedule Generator Demo\n'));
    
    const preferences = examples[studentType];
    if (!preferences) {
        console.log(chalk.red(`Unknown student type: ${studentType}`));
        console.log(chalk.yellow(`Available types: ${Object.keys(examples).join(', ')}`));
        return;
    }
    
    console.log(chalk.cyan(`Generating schedule for: ${chalk.bold(preferences.name)}`));
    console.log(chalk.gray(`Student Type: ${studentType}`));
    console.log(chalk.gray(`Subjects: ${preferences.subjects.join(', ')}`));
    console.log(chalk.gray(`Learning Style: ${preferences.learningStyle}`));
    console.log(chalk.gray(`Daily Study Time: ${preferences.dailyStudyTime} hours`));
    console.log(chalk.gray(`Session Duration: ${preferences.studyDuration} minutes\n`));
    
    // Generate schedule
    const schedule = generateSchedule(preferences);
    
    // Display schedule
    displayScheduleDemo(schedule);
    
    // Show statistics
    const stats = calculateStudyStats(schedule);
    displayStats(stats);
    
    // Show study tips
    const tips = generateStudyTips(preferences);
    displayTips(tips);
}

function displayScheduleDemo(schedule) {
    console.log(chalk.blue.bold('📅 Generated Schedule\n'));
    
    schedule.days.forEach((day, index) => {
        if (index >= 3) return; // Show only first 3 days for demo
        
        console.log(chalk.cyan.bold(`${day.date} (${day.dayName})`));
        console.log(chalk.gray('-'.repeat(30)));
        
        if (day.sessions.length === 0) {
            console.log(chalk.gray('  No study sessions scheduled'));
        } else {
            day.sessions.forEach(session => {
                const timeRange = `${session.startTime} - ${session.endTime}`;
                const duration = `(${session.duration} min)`;
                const subject = chalk.yellow(session.subject);
                const topic = session.topic ? ` - ${session.topic}` : '';
                const method = session.method ? chalk.gray(` [${session.method}]`) : '';
                
                console.log(`  ${chalk.green(timeRange)} ${duration}`);
                console.log(`    ${subject}${topic}${method}`);
                
                if (session.type === 'review') {
                    console.log(chalk.gray(`    📝 Review session`));
                }
                
                if (session.recommendation) {
                    console.log(chalk.gray(`    💡 ${session.recommendation}`));
                }
                
                if (session.break) {
                    console.log(chalk.gray(`    ☕ ${session.break.duration} min break after`));
                }
                console.log();
            });
        }
    });
    
    if (schedule.days.length > 3) {
        console.log(chalk.gray(`... and ${schedule.days.length - 3} more days\n`));
    }
}

function displayStats(stats) {
    console.log(chalk.blue.bold('📊 Schedule Statistics\n'));
    console.log(`Total Study Time: ${chalk.green(stats.totalStudyTime)} minutes (${Math.round(stats.totalStudyTime / 60)} hours)`);
    console.log(`Total Sessions: ${chalk.green(stats.totalSessions)}`);
    console.log(`Average Session Length: ${chalk.green(stats.averageSessionLength)} minutes`);
    console.log(`Study Days: ${chalk.green(stats.studyDays)}`);
    console.log(`Total Break Time: ${chalk.green(stats.totalBreakTime)} minutes\n`);
    
    console.log(chalk.blue('Subject Breakdown:'));
    Object.entries(stats.subjectBreakdown).forEach(([subject, data]) => {
        const hours = Math.round(data.totalTime / 60 * 10) / 10;
        console.log(`  ${chalk.yellow(subject)}: ${data.sessions} sessions, ${hours} hours`);
    });
    console.log();
}

function displayTips(tips) {
    console.log(chalk.blue.bold('💡 Study Tips\n'));
    tips.forEach((tip, index) => {
        console.log(`${index + 1}. ${tip}`);
    });
    console.log();
}

// Command line interface
if (require.main === module) {
    const studentType = process.argv[2] || 'highSchoolStudent';
    
    console.log(chalk.blue('Available student types:'));
    Object.keys(examples).forEach(type => {
        console.log(`  - ${type}`);
    });
    console.log();
    
    runDemo(studentType);
}

module.exports = { runDemo, examples };
