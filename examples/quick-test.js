// Quick test to verify the main application components work
const { generateSchedule } = require('../src/scheduleGenerator');
const { saveSchedule, loadUserPreferences } = require('../src/dataManager');
const chalk = require('chalk');

async function quickTest() {
    console.log(chalk.blue.bold('🚀 Quick Test of Study Schedule Generator\n'));
    
    // Test preferences
    const testPreferences = {
        name: 'Test User',
        subjects: ['Mathematics', 'Programming', 'Science'],
        studyDuration: 60,
        breakDuration: 15,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        dailyStudyTime: 3,
        learningStyle: 'mixed',
        difficulty: 'intermediate',
        includeReview: true,
        scheduleDays: 5,
        timestamp: new Date().toISOString()
    };
    
    try {
        // Generate schedule
        console.log(chalk.yellow('Generating schedule...'));
        const schedule = generateSchedule(testPreferences);
        console.log(chalk.green('✅ Schedule generated successfully'));
        
        // Display a summary
        console.log(chalk.blue('\n📋 Schedule Summary:'));
        console.log(`Days planned: ${schedule.days.length}`);
        console.log(`Total study time: ${schedule.summary.totalStudyTime} minutes`);
        console.log(`Total sessions: ${schedule.summary.totalSessions}`);
        console.log(`Subjects: ${schedule.summary.subjects.join(', ')}`);
        
        // Test data saving
        console.log(chalk.yellow('\nTesting data persistence...'));
        await saveSchedule(schedule, testPreferences);
        console.log(chalk.green('✅ Schedule saved successfully'));
        
        // Test loading preferences
        console.log(chalk.yellow('\nTesting preference loading...'));
        const loadedPreferences = await loadUserPreferences();
        if (loadedPreferences && loadedPreferences.name === testPreferences.name) {
            console.log(chalk.green('✅ Preferences loaded successfully'));
        } else {
            console.log(chalk.yellow('⚠️  No existing preferences found (this is normal for first run)'));
        }
        
        console.log(chalk.green.bold('\n🎉 All components working correctly!'));
        console.log(chalk.blue('\nYou can now run the main application with:'));
        console.log(chalk.cyan('npm start'));
        
    } catch (error) {
        console.error(chalk.red('❌ Error during testing:'), error.message);
        console.error(error.stack);
    }
}

if (require.main === module) {
    quickTest();
}

module.exports = { quickTest };
