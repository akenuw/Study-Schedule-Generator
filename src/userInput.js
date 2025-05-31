const inquirer = require('inquirer');
const chalk = require('chalk');

async function getUserInput(existingPreferences = null) {
    console.log(chalk.blue('Let\'s set up your study preferences:\n'));
    
    const questions = [
        {
            type: 'input',
            name: 'name',
            message: 'What\'s your name?',
            default: existingPreferences?.name || 'Student',
            validate: input => input.trim().length > 0 || 'Please enter your name'
        },
        {
            type: 'checkbox',
            name: 'subjects',
            message: 'Which subjects do you want to study?',
            choices: [
                'Mathematics',
                'Science',
                'History',
                'Literature',
                'Programming',
                'Languages',
                'Art',
                'Music',
                'Other'
            ],
            default: existingPreferences?.subjects || [],
            validate: input => input.length > 0 || 'Please select at least one subject'
        },
        {
            type: 'input',
            name: 'customSubjects',
            message: 'Enter any custom subjects (comma-separated):',
            when: answers => answers.subjects.includes('Other'),
            filter: input => input.split(',').map(s => s.trim()).filter(s => s.length > 0)
        },
        {
            type: 'list',
            name: 'studyDuration',
            message: 'How long do you prefer to study per session?',
            choices: [
                { name: '25 minutes (Pomodoro)', value: 25 },
                { name: '45 minutes', value: 45 },
                { name: '60 minutes', value: 60 },
                { name: '90 minutes', value: 90 },
                { name: 'Custom duration', value: 'custom' }
            ],
            default: existingPreferences?.studyDuration || 45
        },
        {
            type: 'number',
            name: 'customDuration',
            message: 'Enter your preferred session duration (minutes):',
            when: answers => answers.studyDuration === 'custom',
            validate: input => (input > 0 && input <= 240) || 'Duration must be between 1 and 240 minutes'
        },
        {
            type: 'list',
            name: 'breakDuration',
            message: 'How long breaks do you prefer?',
            choices: [
                { name: '5 minutes', value: 5 },
                { name: '10 minutes', value: 10 },
                { name: '15 minutes', value: 15 },
                { name: '20 minutes', value: 20 }
            ],
            default: existingPreferences?.breakDuration || 10
        },
        {
            type: 'checkbox',
            name: 'availableDays',
            message: 'Which days are you available to study?',
            choices: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday'
            ],
            default: existingPreferences?.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            validate: input => input.length > 0 || 'Please select at least one day'
        },
        {
            type: 'input',
            name: 'dailyStudyTime',
            message: 'How many hours per day do you want to study? (e.g., 2.5)',
            default: existingPreferences?.dailyStudyTime || '2',
            validate: input => {
                const num = parseFloat(input);
                return (num > 0 && num <= 12) || 'Please enter a number between 0.5 and 12';
            },
            filter: input => parseFloat(input)
        },
        {
            type: 'list',
            name: 'learningStyle',
            message: 'What\'s your preferred learning style?',
            choices: [
                { name: 'Visual (reading, diagrams, charts)', value: 'visual' },
                { name: 'Auditory (listening, discussion)', value: 'auditory' },
                { name: 'Kinesthetic (hands-on, practice)', value: 'kinesthetic' },
                { name: 'Mixed approach', value: 'mixed' }
            ],
            default: existingPreferences?.learningStyle || 'mixed'
        },
        {
            type: 'list',
            name: 'difficulty',
            message: 'How would you rate your current level in these subjects?',
            choices: [
                { name: 'Beginner', value: 'beginner' },
                { name: 'Intermediate', value: 'intermediate' },
                { name: 'Advanced', value: 'advanced' },
                { name: 'Mixed levels', value: 'mixed' }
            ],
            default: existingPreferences?.difficulty || 'intermediate'
        },
        {
            type: 'confirm',
            name: 'includeReview',
            message: 'Include review sessions for spaced repetition?',
            default: existingPreferences?.includeReview !== undefined ? existingPreferences.includeReview : true
        },
        {
            type: 'number',
            name: 'scheduleDays',
            message: 'How many days ahead should I plan your schedule?',
            default: existingPreferences?.scheduleDays || 7,
            validate: input => (input >= 1 && input <= 30) || 'Please enter a number between 1 and 30'
        }
    ];

    const answers = await inquirer.prompt(questions);
    
    // Process answers
    const preferences = {
        ...answers,
        studyDuration: answers.customDuration || answers.studyDuration,
        subjects: [...answers.subjects.filter(s => s !== 'Other'), ...(answers.customSubjects || [])],
        timestamp: new Date().toISOString()
    };
    
    delete preferences.customDuration;
    delete preferences.customSubjects;
    
    return preferences;
}

module.exports = { getUserInput };
