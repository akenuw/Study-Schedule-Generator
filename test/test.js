const { generateSchedule } = require('../src/scheduleGenerator');
const { validateSchedulePreferences, calculateStudyStats } = require('../src/utils');
const chalk = require('chalk');

// Test data
const testPreferences = {
    name: 'Test Student',
    subjects: ['Mathematics', 'Science', 'Programming'],
    studyDuration: 60,
    breakDuration: 15,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    dailyStudyTime: 3,
    learningStyle: 'mixed',
    difficulty: 'intermediate',
    includeReview: true,
    scheduleDays: 7
};

function runTests() {
    console.log(chalk.blue.bold('\n🧪 Running Study Schedule Generator Tests\n'));
    
    let passed = 0;
    let failed = 0;
    
    // Test 1: Validate preferences
    console.log(chalk.yellow('Test 1: Validating preferences...'));
    try {
        const errors = validateSchedulePreferences(testPreferences);
        if (errors.length === 0) {
            console.log(chalk.green('✅ Preferences validation passed'));
            passed++;
        } else {
            console.log(chalk.red('❌ Preferences validation failed:', errors));
            failed++;
        }
    } catch (error) {
        console.log(chalk.red('❌ Preferences validation error:', error.message));
        failed++;
    }
    
    // Test 2: Generate schedule
    console.log(chalk.yellow('\nTest 2: Generating schedule...'));
    try {
        const schedule = generateSchedule(testPreferences);
        
        if (schedule && schedule.days && schedule.days.length === 7) {
            console.log(chalk.green('✅ Schedule generation passed'));
            passed++;
            
            // Test 3: Verify schedule content
            console.log(chalk.yellow('\nTest 3: Verifying schedule content...'));
            
            const studyDays = schedule.days.filter(day => day.sessions.length > 0);
            const totalSessions = schedule.days.reduce((total, day) => total + day.sessions.length, 0);
            
            if (studyDays.length > 0 && totalSessions > 0) {
                console.log(chalk.green('✅ Schedule content verification passed'));
                console.log(chalk.gray(`   - Study days: ${studyDays.length}`));
                console.log(chalk.gray(`   - Total sessions: ${totalSessions}`));
                passed++;
            } else {
                console.log(chalk.red('❌ Schedule content verification failed'));
                failed++;
            }
            
            // Test 4: Calculate statistics
            console.log(chalk.yellow('\nTest 4: Calculating statistics...'));
            try {
                const stats = calculateStudyStats(schedule);
                
                if (stats.totalStudyTime > 0 && stats.totalSessions > 0) {
                    console.log(chalk.green('✅ Statistics calculation passed'));
                    console.log(chalk.gray(`   - Total study time: ${stats.totalStudyTime} minutes`));
                    console.log(chalk.gray(`   - Average session: ${stats.averageSessionLength} minutes`));
                    console.log(chalk.gray(`   - Study days: ${stats.studyDays}`));
                    passed++;
                } else {
                    console.log(chalk.red('❌ Statistics calculation failed'));
                    failed++;
                }
            } catch (error) {
                console.log(chalk.red('❌ Statistics calculation error:', error.message));
                failed++;
            }
            
            // Test 5: Verify subjects are included
            console.log(chalk.yellow('\nTest 5: Verifying subject distribution...'));
            const scheduledSubjects = new Set();
            schedule.days.forEach(day => {
                day.sessions.forEach(session => {
                    scheduledSubjects.add(session.subject);
                });
            });
            
            const allSubjectsIncluded = testPreferences.subjects.every(subject => 
                scheduledSubjects.has(subject)
            );
            
            if (allSubjectsIncluded) {
                console.log(chalk.green('✅ Subject distribution verification passed'));
                console.log(chalk.gray(`   - Scheduled subjects: ${Array.from(scheduledSubjects).join(', ')}`));
                passed++;
            } else {
                console.log(chalk.red('❌ Subject distribution verification failed'));
                console.log(chalk.gray(`   - Expected: ${testPreferences.subjects.join(', ')}`));
                console.log(chalk.gray(`   - Scheduled: ${Array.from(scheduledSubjects).join(', ')}`));
                failed++;
            }
            
        } else {
            console.log(chalk.red('❌ Schedule generation failed - invalid structure'));
            failed++;
        }
    } catch (error) {
        console.log(chalk.red('❌ Schedule generation error:', error.message));
        failed++;
    }
    
    // Test summary
    console.log(chalk.blue.bold('\n📊 Test Results'));
    console.log(chalk.gray('================'));
    console.log(chalk.green(`✅ Passed: ${passed}`));
    console.log(chalk.red(`❌ Failed: ${failed}`));
    console.log(chalk.blue(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`));
    
    if (failed === 0) {
        console.log(chalk.green.bold('\n🎉 All tests passed! The Study Schedule Generator is working correctly.'));
    } else {
        console.log(chalk.yellow.bold('\n⚠️  Some tests failed. Please check the implementation.'));
    }
    
    return { passed, failed };
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}

module.exports = { runTests };
