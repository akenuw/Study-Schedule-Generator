import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Alert,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Create as CreateIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const ScheduleHistory = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/schedules`);
      if (response.data.success) {
        setSchedules(response.data.schedules);
      } else {
        setError('Failed to load schedules');
      }
    } catch (error) {
      setError('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSchedule = (schedule) => {
    // For now, we'll just show an alert since we don't have the full schedule data
    // In a real implementation, you'd load the full schedule and navigate to the display
    alert(`Viewing schedule for ${schedule.studentName} created on ${new Date(schedule.createdAt).toLocaleDateString()}`);
  };

  const handleExportSchedule = async (schedule) => {
    try {
      // This would need the full schedule data to export
      alert(`Export functionality would export ${schedule.filename}`);
    } catch (error) {
      alert('Failed to export schedule');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" color="primary">
          <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Schedule History
        </Typography>
        <Button
          variant="contained"
          startIcon={<CreateIcon />}
          onClick={() => navigate('/create')}
        >
          Create New Schedule
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {schedules.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No schedules found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You haven't created any study schedules yet.
          </Typography>
          <Button
            variant="contained"
            startIcon={<CreateIcon />}
            onClick={() => navigate('/create')}
          >
            Create Your First Schedule
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ p: 0 }}>
          <List>
            {schedules.map((schedule, index) => (
              <ListItem
                key={index}
                divider={index < schedules.length - 1}
                sx={{ py: 2 }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6">
                        {schedule.studentName || 'Unnamed Schedule'}
                      </Typography>
                      <Chip
                        label={`${schedule.totalSessions} sessions`}
                        size="small"
                        color="primary"
                      />
                      <Chip
                        label={formatDuration(schedule.totalStudyTime)}
                        size="small"
                        color="secondary"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Created: {formatDate(schedule.createdAt)}
                      </Typography>
                      {schedule.subjects && (
                        <Typography variant="body2" color="text.secondary">
                          Subjects: {schedule.subjects.join(', ')}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      edge="end"
                      aria-label="view"
                      onClick={() => handleViewSchedule(schedule)}
                      color="primary"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="export"
                      onClick={() => handleExportSchedule(schedule)}
                      color="secondary"
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {schedules.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Total schedules: {schedules.length}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ScheduleHistory;
