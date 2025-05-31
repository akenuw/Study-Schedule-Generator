const axios = require('axios');
const chalk = require('chalk');

const API_BASE_URL = 'http://localhost:3001/api';

// Test data
const testPreferences = {
    name: 'Web App Test User',
    subjects: ['Mathematics', 'Science', 'Programming', 'History'],
    studyDuration: 60,
    breakDuration: 15,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    dailyStudyTime: 4,
    learningStyle: 'mixed',
    difficulty: 'intermediate',
    includeReview: true,
    scheduleDays: 7,
    timestamp: new Date().toISOString()
};

async function runWebAppTests() {
    console.log(chalk.blue.bold('\n🌐 Running Web Application Tests\n'));
    
    let passed = 0;
    let failed = 0;
    
    // Test 1: Health Check
    console.log(chalk.yellow('Test 1: API Health Check...'));
    try {
        const response = await axios.get(`${API_BASE_URL}/health`);
        
        if (response.status === 200 && response.data.status === 'OK') {
            console.log(chalk.green('✅ Health check passed'));
            console.log(chalk.gray(`   - Status: ${response.data.status}`));
            console.log(chalk.gray(`   - Version: ${response.data.version}`));
            passed++;
        } else {
            console.log(chalk.red('❌ Health check failed - invalid response'));
            failed++;
        }
    } catch (error) {
        console.log(chalk.red('❌ Health check failed:', error.message));
        failed++;
    }
    
    // Test 2: Save Preferences
    console.log(chalk.yellow('\nTest 2: Save Preferences...'));
    try {
        const response = await axios.post(`${API_BASE_URL}/preferences`, testPreferences);
        
        if (response.status === 200 && response.data.success) {
            console.log(chalk.green('✅ Preferences saved successfully'));
            passed++;
        } else {
            console.log(chalk.red('❌ Failed to save preferences'));
            failed++;
        }
    } catch (error) {
        console.log(chalk.red('❌ Save preferences error:', error.response?.data?.message || error.message));
        failed++;
    }
    
    // Test 3: Load Preferences
    console.log(chalk.yellow('\nTest 3: Load Preferences...'));
    try {
        const response = await axios.get(`${API_BASE_URL}/preferences`);
        
        if (response.status === 200 && response.data.success && response.data.preferences) {
            console.log(chalk.green('✅ Preferences loaded successfully'));
            console.log(chalk.gray(`   - Name: ${response.data.preferences.name}`));
            console.log(chalk.gray(`   - Subjects: ${response.data.preferences.subjects.join(', ')}`));
            passed++;
        } else {
            console.log(chalk.red('❌ Failed to load preferences'));
            failed++;
        }
    } catch (error) {
        console.log(chalk.red('❌ Load preferences error:', error.response?.data?.message || error.message));
        failed++;
    }
    
    // Test 4: Generate Schedule
    console.log(chalk.yellow('\nTest 4: Generate Schedule...'));
    try {
        const response = await axios.post(`${API_BASE_URL}/schedule/generate`, testPreferences);
        
        if (response.status === 200 && response.data.success) {
            const { schedule, stats, tips } = response.data;
            
            console.log(chalk.green('✅ Schedule generated successfully'));
            console.log(chalk.gray(`   - Total study time: ${stats.totalStudyTime} minutes`));
            console.log(chalk.gray(`   - Total sessions: ${stats.totalSessions}`));
            console.log(chalk.gray(`   - Study days: ${stats.studyDays}`));
            console.log(chalk.gray(`   - Tips provided: ${tips.length}`));
            
            // Validate schedule structure
            if (schedule.days && schedule.days.length === testPreferences.scheduleDays) {
                console.log(chalk.green('✅ Schedule structure validation passed'));
                passed++;
            } else {
                console.log(chalk.red('❌ Schedule structure validation failed'));
                failed++;
            }
            
            // Store schedule for export test
            global.testSchedule = schedule;
            passed++;
        } else {
            console.log(chalk.red('❌ Failed to generate schedule'));
            failed++;
        }
    } catch (error) {
        console.log(chalk.red('❌ Generate schedule error:', error.response?.data?.message || error.message));
        failed++;
    }
    
    // Test 5: Export Schedule
    console.log(chalk.yellow('\nTest 5: Export Schedule...'));
    try {
        if (global.testSchedule) {
            const response = await axios.post(`${API_BASE_URL}/schedule/export`, {
                schedule: global.testSchedule,
                filename: 'test-export.csv'
            });
            
            if (response.status === 200 && response.data.success) {
                console.log(chalk.green('✅ Schedule exported successfully'));
                console.log(chalk.gray(`   - Filename: ${response.data.filename}`));
                passed++;
            } else {
                console.log(chalk.red('❌ Failed to export schedule'));
                failed++;
            }
        } else {
            console.log(chalk.yellow('⚠️  Skipping export test - no schedule available'));
        }
    } catch (error) {
        console.log(chalk.red('❌ Export schedule error:', error.response?.data?.message || error.message));
        failed++;
    }
    
    // Test 6: Get Study Tips
    console.log(chalk.yellow('\nTest 6: Get Study Tips...'));
    try {
        const response = await axios.post(`${API_BASE_URL}/tips`, testPreferences);
        
        if (response.status === 200 && response.data.success && response.data.tips) {
            console.log(chalk.green('✅ Study tips retrieved successfully'));
            console.log(chalk.gray(`   - Number of tips: ${response.data.tips.length}`));
            console.log(chalk.gray(`   - Sample tip: ${response.data.tips[0]}`));
            passed++;
        } else {
            console.log(chalk.red('❌ Failed to get study tips'));
            failed++;
        }
    } catch (error) {
        console.log(chalk.red('❌ Get study tips error:', error.response?.data?.message || error.message));
        failed++;
    }
    
    // Test 7: List Schedules
    console.log(chalk.yellow('\nTest 7: List Schedules...'));
    try {
        const response = await axios.get(`${API_BASE_URL}/schedules`);
        
        if (response.status === 200 && response.data.success) {
            console.log(chalk.green('✅ Schedules listed successfully'));
            console.log(chalk.gray(`   - Number of schedules: ${response.data.schedules.length}`));
            if (response.data.schedules.length > 0) {
                const latest = response.data.schedules[0];
                console.log(chalk.gray(`   - Latest: ${latest.studentName} (${latest.totalSessions} sessions)`));
            }
            passed++;
        } else {
            console.log(chalk.red('❌ Failed to list schedules'));
            failed++;
        }
    } catch (error) {
        console.log(chalk.red('❌ List schedules error:', error.response?.data?.message || error.message));
        failed++;
    }
    
    // Test 8: Error Handling
    console.log(chalk.yellow('\nTest 8: Error Handling...'));
    try {
        const invalidPreferences = { name: '' }; // Invalid data
        const response = await axios.post(`${API_BASE_URL}/schedule/generate`, invalidPreferences);
        
        // Should not reach here
        console.log(chalk.red('❌ Error handling failed - should have returned error'));
        failed++;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.log(chalk.green('✅ Error handling working correctly'));
            console.log(chalk.gray(`   - Status: ${error.response.status}`));
            console.log(chalk.gray(`   - Error: ${error.response.data.error}`));
            passed++;
        } else {
            console.log(chalk.red('❌ Unexpected error response:', error.message));
            failed++;
        }
    }
    
    // Test Summary
    console.log(chalk.blue.bold('\n📊 Web Application Test Results'));
    console.log(chalk.gray('====================================='));
    console.log(chalk.green(`✅ Passed: ${passed}`));
    console.log(chalk.red(`❌ Failed: ${failed}`));
    console.log(chalk.blue(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`));
    
    if (failed === 0) {
        console.log(chalk.green.bold('\n🎉 All web application tests passed! The API is working correctly.'));
        console.log(chalk.blue('\n🌐 You can now access the web application at:'));
        console.log(chalk.cyan('   http://localhost:3001'));
    } else {
        console.log(chalk.yellow.bold('\n⚠️  Some tests failed. Please check the API server and try again.'));
    }
    
    return { passed, failed };
}

// Run tests if this file is executed directly
if (require.main === module) {
    runWebAppTests().catch(error => {
        console.error(chalk.red('\n💥 Test execution failed:'), error.message);
        process.exit(1);
    });
}

module.exports = { runWebAppTests };
