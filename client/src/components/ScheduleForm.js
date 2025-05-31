import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
  Grid,
  Chip,
  FormGroup,
  Alert,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const ScheduleForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    subjects: [],
    customSubject: '',
    studyDuration: 60,
    breakDuration: 15,
    availableDays: [],
    dailyStudyTime: 3,
    learningStyle: 'mixed',
    difficulty: 'intermediate',
    includeReview: true,
    scheduleDays: 7,
  });

  const predefinedSubjects = [
    'Mathematics',
    'Science',
    'History',
    'Literature',
    'Programming',
    'Languages',
    'Art',
    'Music',
    'Business',
    'Psychology',
  ];

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const learningStyles = [
    { value: 'visual', label: 'Visual (reading, diagrams, charts)' },
    { value: 'auditory', label: 'Auditory (listening, discussion)' },
    { value: 'kinesthetic', label: 'Kinesthetic (hands-on, practice)' },
    { value: 'mixed', label: 'Mixed approach' },
  ];

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'mixed', label: 'Mixed levels' },
  ];

  // Load existing preferences on component mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/preferences`);
        if (response.data.success && response.data.preferences) {
          setFormData(prev => ({
            ...prev,
            ...response.data.preferences,
          }));
        }
      } catch (error) {
        console.log('No existing preferences found');
      }
    };

    loadPreferences();
  }, []);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubjectToggle = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleAddCustomSubject = () => {
    if (formData.customSubject.trim() && !formData.subjects.includes(formData.customSubject.trim())) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, prev.customSubject.trim()],
        customSubject: '',
      }));
    }
  };

  const handleRemoveSubject = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject),
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }

    if (formData.subjects.length === 0) {
      setError('Please select at least one subject');
      setLoading(false);
      return;
    }

    if (formData.availableDays.length === 0) {
      setError('Please select at least one available day');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/schedule/generate`, {
        ...formData,
        timestamp: new Date().toISOString(),
      });

      if (response.data.success) {
        // Store the generated schedule in localStorage for the display component
        localStorage.setItem('currentSchedule', JSON.stringify(response.data));
        navigate('/schedule');
      } else {
        setError('Failed to generate schedule');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to generate schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom color="primary">
        Create Your Study Schedule
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Fill out your preferences to generate a personalized study schedule
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Your Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Learning Style</InputLabel>
                <Select
                  value={formData.learningStyle}
                  onChange={handleInputChange('learningStyle')}
                  label="Learning Style"
                >
                  {learningStyles.map((style) => (
                    <MenuItem key={style.value} value={style.value}>
                      {style.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Subjects */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Subjects
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Select the subjects you want to study
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {predefinedSubjects.map((subject) => (
                  <Chip
                    key={subject}
                    label={subject}
                    onClick={() => handleSubjectToggle(subject)}
                    color={formData.subjects.includes(subject) ? 'primary' : 'default'}
                    variant={formData.subjects.includes(subject) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Add Custom Subject"
                value={formData.customSubject}
                onChange={handleInputChange('customSubject')}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSubject()}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleAddCustomSubject}
                sx={{ height: '56px' }}
              >
                Add Subject
              </Button>
            </Grid>

            {formData.subjects.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>
                  Selected Subjects:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.subjects.map((subject) => (
                    <Chip
                      key={subject}
                      label={subject}
                      onDelete={() => handleRemoveSubject(subject)}
                      color="primary"
                    />
                  ))}
                </Box>
              </Grid>
            )}

            {/* Study Preferences */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Study Preferences
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Session Duration</InputLabel>
                <Select
                  value={formData.studyDuration}
                  onChange={handleInputChange('studyDuration')}
                  label="Session Duration"
                >
                  <MenuItem value={25}>25 minutes (Pomodoro)</MenuItem>
                  <MenuItem value={45}>45 minutes</MenuItem>
                  <MenuItem value={60}>60 minutes</MenuItem>
                  <MenuItem value={90}>90 minutes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Break Duration</InputLabel>
                <Select
                  value={formData.breakDuration}
                  onChange={handleInputChange('breakDuration')}
                  label="Break Duration"
                >
                  <MenuItem value={5}>5 minutes</MenuItem>
                  <MenuItem value={10}>10 minutes</MenuItem>
                  <MenuItem value={15}>15 minutes</MenuItem>
                  <MenuItem value={20}>20 minutes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Daily Study Hours"
                value={formData.dailyStudyTime}
                onChange={handleInputChange('dailyStudyTime')}
                inputProps={{ min: 0.5, max: 12, step: 0.5 }}
              />
            </Grid>

            {/* Available Days */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Available Days
              </Typography>
              <FormGroup row>
                {daysOfWeek.map((day) => (
                  <FormControlLabel
                    key={day}
                    control={
                      <Checkbox
                        checked={formData.availableDays.includes(day)}
                        onChange={() => handleDayToggle(day)}
                      />
                    }
                    label={day}
                  />
                ))}
              </FormGroup>
            </Grid>

            {/* Additional Options */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Additional Options
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  value={formData.difficulty}
                  onChange={handleInputChange('difficulty')}
                  label="Difficulty Level"
                >
                  {difficultyLevels.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Schedule Days Ahead"
                value={formData.scheduleDays}
                onChange={handleInputChange('scheduleDays')}
                inputProps={{ min: 1, max: 30 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.includeReview}
                    onChange={(e) => setFormData(prev => ({ ...prev, includeReview: e.target.checked }))}
                  />
                }
                label="Include spaced repetition review sessions"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={loading}
                  loadingIndicator={<CircularProgress size={24} />}
                  size="large"
                >
                  Generate Schedule
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ScheduleForm;
