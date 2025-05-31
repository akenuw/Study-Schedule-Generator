const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const DATA_DIR = path.join(process.cwd(), 'data');
const PREFERENCES_FILE = path.join(DATA_DIR, 'preferences.json');
const SCHEDULES_DIR = path.join(DATA_DIR, 'schedules');

async function ensureDataDirectories() {
    try {
        await fs.ensureDir(DATA_DIR);
        await fs.ensureDir(SCHEDULES_DIR);
    } catch (error) {
        console.error(chalk.red('Error creating data directories:'), error.message);
    }
}

async function saveUserPreferences(preferences) {
    try {
        await ensureDataDirectories();
        await fs.writeJson(PREFERENCES_FILE, preferences, { spaces: 2 });
        console.log(chalk.green('✅ Preferences saved successfully!'));
    } catch (error) {
        console.error(chalk.red('Error saving preferences:'), error.message);
        throw error;
    }
}

async function loadUserPreferences() {
    try {
        if (await fs.pathExists(PREFERENCES_FILE)) {
            const preferences = await fs.readJson(PREFERENCES_FILE);
            console.log(chalk.blue('📋 Loaded existing preferences'));
            return preferences;
        }
    } catch (error) {
        console.log(chalk.yellow('⚠️  Could not load existing preferences, starting fresh'));
    }
    return null;
}

async function saveSchedule(schedule, preferences) {
    try {
        await ensureDataDirectories();
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `schedule-${timestamp}.json`;
        const filepath = path.join(SCHEDULES_DIR, filename);
        
        const scheduleData = {
            ...schedule,
            metadata: {
                createdAt: new Date().toISOString(),
                version: '1.0.0',
                preferences: preferences
            }
        };
        
        await fs.writeJson(filepath, scheduleData, { spaces: 2 });
        
        // Also save preferences for future use
        await saveUserPreferences(preferences);
        
        console.log(chalk.green(`📁 Schedule saved to: ${filename}`));
        
        // Save a quick reference file
        await saveScheduleSummary(schedule, preferences);
        
    } catch (error) {
        console.error(chalk.red('Error saving schedule:'), error.message);
        throw error;
    }
}

async function saveScheduleSummary(schedule, preferences) {
    try {
        const summaryFile = path.join(DATA_DIR, 'latest-schedule-summary.txt');
        
        let summary = `Study Schedule Summary\n`;
        summary += `Generated: ${new Date().toLocaleString()}\n`;
        summary += `Student: ${preferences.name}\n`;
        summary += `Duration: ${preferences.scheduleDays} days\n`;
        summary += `Subjects: ${preferences.subjects.join(', ')}\n`;
        summary += `Daily Study Time: ${preferences.dailyStudyTime} hours\n`;
        summary += `Session Duration: ${preferences.studyDuration} minutes\n\n`;
        
        summary += `Schedule Overview:\n`;
        summary += `==================\n\n`;
        
        schedule.days.forEach(day => {
            summary += `${day.date} (${day.dayName})\n`;
            if (day.sessions.length === 0) {
                summary += `  No study sessions scheduled\n\n`;
            } else {
                day.sessions.forEach(session => {
                    summary += `  ${session.startTime} - ${session.endTime} | ${session.subject}`;
                    if (session.topic) {
                        summary += ` - ${session.topic}`;
                    }
                    summary += ` (${session.duration} min)\n`;
                });
                summary += `\n`;
            }
        });
        
        summary += `\nTotal Study Time: ${schedule.summary.totalStudyTime} minutes\n`;
        summary += `Total Sessions: ${schedule.summary.totalSessions}\n`;
        
        await fs.writeFile(summaryFile, summary);
        
    } catch (error) {
        console.error(chalk.yellow('Warning: Could not save schedule summary'), error.message);
    }
}

async function loadSchedule(filename) {
    try {
        const filepath = path.join(SCHEDULES_DIR, filename);
        if (await fs.pathExists(filepath)) {
            return await fs.readJson(filepath);
        }
        throw new Error(`Schedule file not found: ${filename}`);
    } catch (error) {
        console.error(chalk.red('Error loading schedule:'), error.message);
        throw error;
    }
}

async function listSchedules() {
    try {
        await ensureDataDirectories();
        const files = await fs.readdir(SCHEDULES_DIR);
        const scheduleFiles = files.filter(file => file.endsWith('.json'));
        
        if (scheduleFiles.length === 0) {
            console.log(chalk.yellow('No saved schedules found.'));
            return [];
        }
        
        console.log(chalk.blue('\n📚 Saved Schedules:'));
        console.log(chalk.gray('=================='));
        
        const schedules = [];
        for (const file of scheduleFiles) {
            try {
                const schedule = await loadSchedule(file);
                const createdAt = new Date(schedule.metadata?.createdAt || 0).toLocaleString();
                const studentName = schedule.metadata?.preferences?.name || 'Unknown';
                
                console.log(`${chalk.green(file)} - ${studentName} (${createdAt})`);
                schedules.push({ filename: file, schedule });
            } catch (error) {
                console.log(`${chalk.red(file)} - Error loading file`);
            }
        }
        
        return schedules;
    } catch (error) {
        console.error(chalk.red('Error listing schedules:'), error.message);
        return [];
    }
}

async function deleteSchedule(filename) {
    try {
        const filepath = path.join(SCHEDULES_DIR, filename);
        if (await fs.pathExists(filepath)) {
            await fs.remove(filepath);
            console.log(chalk.green(`✅ Deleted schedule: ${filename}`));
        } else {
            throw new Error(`Schedule file not found: ${filename}`);
        }
    } catch (error) {
        console.error(chalk.red('Error deleting schedule:'), error.message);
        throw error;
    }
}

async function exportScheduleToCSV(schedule, filename) {
    try {
        await ensureDataDirectories();
        
        const csvFile = path.join(DATA_DIR, filename || 'schedule-export.csv');
        
        let csv = 'Date,Day,Start Time,End Time,Duration (min),Subject,Topic,Type,Method\n';
        
        schedule.days.forEach(day => {
            if (day.sessions.length === 0) {
                csv += `${day.date},${day.dayName},,,,,No sessions,\n`;
            } else {
                day.sessions.forEach(session => {
                    csv += `${day.date},${day.dayName},${session.startTime},${session.endTime},${session.duration},${session.subject},"${session.topic || ''}",${session.type || 'study'},"${session.method || ''}"\n`;
                });
            }
        });
        
        await fs.writeFile(csvFile, csv);
        console.log(chalk.green(`📊 Schedule exported to CSV: ${path.basename(csvFile)}`));
        
    } catch (error) {
        console.error(chalk.red('Error exporting to CSV:'), error.message);
        throw error;
    }
}

module.exports = {
    saveUserPreferences,
    loadUserPreferences,
    saveSchedule,
    loadSchedule,
    listSchedules,
    deleteSchedule,
    exportScheduleToCSV
};
