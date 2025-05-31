#!/usr/bin/env node

const chalk = require('chalk');
const { spawn } = require('child_process');
const axios = require('axios');

console.log(chalk.blue.bold('\n🎓 Study Schedule Generator - Web Application Demo\n'));

async function checkServerStatus() {
    try {
        const response = await axios.get('http://localhost:3001/api/health');
        return response.data.status === 'OK';
    } catch (error) {
        return false;
    }
}

async function startDemo() {
    console.log(chalk.yellow('Checking if server is running...'));
    
    const isRunning = await checkServerStatus();
    
    if (!isRunning) {
        console.log(chalk.red('❌ Server is not running. Starting server...'));
        console.log(chalk.blue('Please run: npm start'));
        console.log(chalk.gray('Then run this demo again.\n'));
        return;
    }
    
    console.log(chalk.green('✅ Server is running!\n'));
    
    // Display application info
    console.log(chalk.blue.bold('📱 Web Application Features:'));
    console.log(chalk.white('• Modern React frontend with Material-UI'));
    console.log(chalk.white('• Interactive form for study preferences'));
    console.log(chalk.white('• Real-time schedule generation'));
    console.log(chalk.white('• Schedule history and management'));
    console.log(chalk.white('• CSV export functionality'));
    console.log(chalk.white('• Responsive design for all devices\n'));
    
    console.log(chalk.blue.bold('🔧 API Endpoints Available:'));
    console.log(chalk.white('• GET  /api/health - Health check'));
    console.log(chalk.white('• POST /api/schedule/generate - Generate schedule'));
    console.log(chalk.white('• GET  /api/preferences - Load preferences'));
    console.log(chalk.white('• POST /api/preferences - Save preferences'));
    console.log(chalk.white('• GET  /api/schedules - List schedules'));
    console.log(chalk.white('• POST /api/schedule/export - Export to CSV'));
    console.log(chalk.white('• POST /api/tips - Get study tips\n'));
    
    console.log(chalk.blue.bold('🌐 Access the Application:'));
    console.log(chalk.cyan('• Web App: http://localhost:3001'));
    console.log(chalk.cyan('• API Docs: http://localhost:3001/api/health\n'));
    
    console.log(chalk.blue.bold('🚀 Quick Test:'));
    
    try {
        // Test API
        console.log(chalk.yellow('Testing API...'));
        const healthResponse = await axios.get('http://localhost:3001/api/health');
        console.log(chalk.green(`✅ API Health: ${healthResponse.data.status}`));
        
        // Generate sample schedule
        console.log(chalk.yellow('Generating sample schedule...'));
        const samplePreferences = {
            name: 'Demo User',
            subjects: ['Mathematics', 'Science', 'Programming'],
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
        
        const scheduleResponse = await axios.post('http://localhost:3001/api/schedule/generate', samplePreferences);
        
        if (scheduleResponse.data.success) {
            const { stats } = scheduleResponse.data;
            console.log(chalk.green('✅ Sample schedule generated successfully!'));
            console.log(chalk.gray(`   • Total study time: ${Math.round(stats.totalStudyTime / 60)} hours`));
            console.log(chalk.gray(`   • Total sessions: ${stats.totalSessions}`));
            console.log(chalk.gray(`   • Study days: ${stats.studyDays}`));
        }
        
    } catch (error) {
        console.log(chalk.red('❌ API test failed:', error.message));
    }
    
    console.log(chalk.blue.bold('\n📋 How to Use the Web Application:'));
    console.log(chalk.white('1. Open http://localhost:3001 in your browser'));
    console.log(chalk.white('2. Click "Create Schedule" to start'));
    console.log(chalk.white('3. Fill out your study preferences'));
    console.log(chalk.white('4. Click "Generate Schedule" to create your plan'));
    console.log(chalk.white('5. View your personalized study schedule'));
    console.log(chalk.white('6. Export to CSV for calendar integration'));
    console.log(chalk.white('7. Access "Schedule History" to view past schedules\n'));
    
    console.log(chalk.blue.bold('🎯 Key Benefits:'));
    console.log(chalk.white('• Scientifically-based spaced repetition'));
    console.log(chalk.white('• Optimal timing based on cognitive load'));
    console.log(chalk.white('• Personalized to your learning style'));
    console.log(chalk.white('• Balanced subject distribution'));
    console.log(chalk.white('• Smart break scheduling'));
    console.log(chalk.white('• Export to popular calendar apps\n'));
    
    console.log(chalk.green.bold('🎉 Web Application is ready to use!'));
    console.log(chalk.blue('Visit: http://localhost:3001 to get started\n'));
    
    // Offer to open browser
    console.log(chalk.yellow('Would you like to open the web application in your browser?'));
    console.log(chalk.gray('Press Ctrl+C to exit, or wait 5 seconds to auto-open...'));
    
    setTimeout(() => {
        console.log(chalk.blue('Opening web application...'));
        
        // Open browser based on platform
        const platform = process.platform;
        let command;
        
        if (platform === 'win32') {
            command = 'start';
        } else if (platform === 'darwin') {
            command = 'open';
        } else {
            command = 'xdg-open';
        }
        
        spawn(command, ['http://localhost:3001'], { detached: true, stdio: 'ignore' });
        
        console.log(chalk.green('✅ Web application opened in your default browser!'));
        console.log(chalk.blue('Enjoy creating your personalized study schedules! 📚\n'));
        
    }, 5000);
}

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n👋 Demo cancelled. Thanks for trying the Study Schedule Generator!'));
    process.exit(0);
});

// Start the demo
startDemo().catch(error => {
    console.error(chalk.red('\n💥 Demo failed:'), error.message);
    process.exit(1);
});
