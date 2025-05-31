#!/usr/bin/env node

const chalk = require('chalk');
const { getUserInput } = require('./src/userInput');
const { generateSchedule } = require('./src/scheduleGenerator');
const { saveSchedule, loadUserPreferences } = require('./src/dataManager');

async function main() {
    console.log(chalk.blue.bold('\n🎓 Study Schedule Generator\n'));
    console.log(chalk.gray('Create personalized study schedules based on your learning preferences and available time.\n'));

    try {
        // Load existing preferences if available
        const existingPreferences = await loadUserPreferences();
        
        // Get user input
        const userPreferences = await getUserInput(existingPreferences);
        
        // Generate schedule
        console.log(chalk.yellow('\n⏳ Generating your personalized study schedule...\n'));
        const schedule = generateSchedule(userPreferences);
        
        // Display schedule
        displaySchedule(schedule);
        
        // Save schedule
        await saveSchedule(schedule, userPreferences);
        console.log(chalk.green('\n✅ Schedule saved successfully!'));
        
    } catch (error) {
        console.error(chalk.red('\n❌ Error:'), error.message);
        process.exit(1);
    }
}

function displaySchedule(schedule) {
    console.log(chalk.blue.bold('\n📅 Your Personalized Study Schedule\n'));
    console.log(chalk.gray('=' * 50));
    
    schedule.days.forEach((day, index) => {
        console.log(chalk.cyan.bold(`\n${day.date} (${day.dayName})`));
        console.log(chalk.gray('-'.repeat(30)));
        
        if (day.sessions.length === 0) {
            console.log(chalk.gray('  No study sessions scheduled'));
        } else {
            day.sessions.forEach(session => {
                const timeRange = `${session.startTime} - ${session.endTime}`;
                const duration = `(${session.duration} min)`;
                const subject = chalk.yellow(session.subject);
                const topic = session.topic ? ` - ${session.topic}` : '';
                
                console.log(`  ${chalk.green(timeRange)} ${duration}`);
                console.log(`    ${subject}${topic}`);
                
                if (session.type === 'review') {
                    console.log(chalk.gray(`    📝 Review session`));
                }
                
                if (session.break) {
                    console.log(chalk.gray(`    ☕ ${session.break.duration} min break after`));
                }
            });
        }
    });
    
    // Display summary
    console.log(chalk.blue.bold('\n📊 Schedule Summary'));
    console.log(chalk.gray('-'.repeat(20)));
    console.log(`Total study time: ${chalk.green(schedule.summary.totalStudyTime)} minutes`);
    console.log(`Number of sessions: ${chalk.green(schedule.summary.totalSessions)}`);
    console.log(`Subjects covered: ${chalk.green(schedule.summary.subjects.join(', '))}`);
}

if (require.main === module) {
    main();
}

module.exports = { main };
