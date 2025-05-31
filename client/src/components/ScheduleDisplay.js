import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  AccessTime as TimeIcon,
  School as SchoolIcon,
  TrendingUp as StatsIcon,
  Download as DownloadIcon,
  Create as CreateIcon,
  ExpandMore as ExpandMoreIcon,
  Coffee as BreakIcon,
  Psychology as ReviewIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const ScheduleDisplay = () => {
  const navigate = useNavigate();
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load schedule data from localStorage
    const storedData = localStorage.getItem('currentSchedule');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setScheduleData(data);
      } catch (error) {
        setError('Failed to load schedule data');
      }
    } else {
      setError('No schedule data found. Please create a new schedule.');
    }
  }, []);

  const handleExportCSV = async () => {
    if (!scheduleData?.schedule) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/schedule/export`, {
        schedule: scheduleData.schedule,
        filename: `study-schedule-${new Date().toISOString().split('T')[0]}.csv`,
      });

      if (response.data.success) {
        alert(`Schedule exported successfully as ${response.data.filename}`);
      }
    } catch (error) {
      alert('Failed to export schedule');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSessionTypeColor = (type) => {
    switch (type) {
      case 'review':
        return 'secondary';
      case 'study':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/create')}>
          Create New Schedule
        </Button>
      </Box>
    );
  }

  if (!scheduleData) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Loading schedule...</Typography>
      </Box>
    );
  }

  const { schedule, stats, tips } = scheduleData;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" color="primary">
          📅 Your Study Schedule
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportCSV}
            disabled={loading}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<CreateIcon />}
            onClick={() => navigate('/create')}
          >
            Create New
          </Button>
        </Box>
      </Box>

      {/* Schedule Summary */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          <StatsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Schedule Summary
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {Math.round(stats.totalStudyTime / 60)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Hours
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {stats.totalSessions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Study Sessions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {stats.studyDays}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Study Days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {stats.averageSessionLength}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Session (min)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Subject Breakdown:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.entries(stats.subjectBreakdown).map(([subject, data]) => (
              <Chip
                key={subject}
                label={`${subject}: ${data.sessions} sessions`}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Daily Schedule */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Daily Schedule
        </Typography>
        
        {schedule.days.map((day, index) => (
          <Accordion key={index} defaultExpanded={index < 3}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {day.date} ({day.dayName})
                </Typography>
                <Chip
                  label={`${day.sessions.length} sessions`}
                  size="small"
                  color={day.sessions.length > 0 ? 'primary' : 'default'}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {day.sessions.length === 0 ? (
                <Typography color="text.secondary">
                  No study sessions scheduled for this day
                </Typography>
              ) : (
                <List>
                  {day.sessions.map((session, sessionIndex) => (
                    <React.Fragment key={sessionIndex}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <TimeIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography variant="subtitle1">
                                {formatTime(session.startTime)} - {formatTime(session.endTime)}
                              </Typography>
                              <Chip
                                label={session.subject}
                                color="primary"
                                size="small"
                              />
                              <Chip
                                label={session.type}
                                color={getSessionTypeColor(session.type)}
                                size="small"
                                icon={session.type === 'review' ? <ReviewIcon /> : <SchoolIcon />}
                              />
                              {session.difficulty && (
                                <Chip
                                  label={session.difficulty}
                                  color={getDifficultyColor(session.difficulty)}
                                  size="small"
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {session.topic} • {session.duration} minutes
                              </Typography>
                              {session.method && (
                                <Typography variant="body2" color="text.secondary">
                                  Method: {session.method}
                                </Typography>
                              )}
                              {session.recommendation && (
                                <Typography variant="body2" color="primary">
                                  💡 {session.recommendation}
                                </Typography>
                              )}
                              {session.activities && session.activities.length > 0 && (
                                <Typography variant="body2" color="text.secondary">
                                  Activities: {session.activities.slice(0, 2).join(', ')}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      
                      {session.break && sessionIndex < day.sessions.length - 1 && (
                        <ListItem sx={{ px: 0, py: 1 }}>
                          <ListItemIcon>
                            <BreakIcon color="action" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2" color="text.secondary">
                                Break: {session.break.duration} minutes
                              </Typography>
                            }
                          />
                        </ListItem>
                      )}
                      
                      {sessionIndex < day.sessions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      {/* Study Tips */}
      {tips && tips.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            💡 Study Tips
          </Typography>
          <List>
            {tips.map((tip, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemText
                  primary={`${index + 1}. ${tip}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default ScheduleDisplay;
