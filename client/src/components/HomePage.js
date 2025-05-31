import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Psychology as BrainIcon,
  TrendingUp as TrendingUpIcon,
  Timer as TimerIcon,
  School as SchoolIcon,
  Create as CreateIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BrainIcon color="primary" />,
      title: 'Spaced Repetition',
      description: 'Uses scientifically-proven spaced repetition for better retention',
    },
    {
      icon: <TimerIcon color="primary" />,
      title: 'Optimal Timing',
      description: 'Schedules difficult subjects during peak cognitive hours',
    },
    {
      icon: <TrendingUpIcon color="primary" />,
      title: 'Personalized',
      description: 'Adapts to your learning style and available time',
    },
    {
      icon: <ScheduleIcon color="primary" />,
      title: 'Smart Scheduling',
      description: 'Balances subjects and prevents study monotony',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          🎓 Study Schedule Generator
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Create personalized study schedules based on your learning preferences and available time
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<CreateIcon />}
            onClick={() => navigate('/create')}
            sx={{ minWidth: 200 }}
          >
            Create Schedule
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<HistoryIcon />}
            onClick={() => navigate('/history')}
            sx={{ minWidth: 200 }}
          >
            View History
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom color="primary">
          How It Works
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <SchoolIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="1. Set Your Preferences"
              secondary="Choose your subjects, learning style, available time, and study goals"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <BrainIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="2. AI-Powered Optimization"
              secondary="Our algorithm creates an optimized schedule using cognitive science principles"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ScheduleIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="3. Get Your Schedule"
              secondary="Receive a personalized study schedule with spaced repetition and optimal timing"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <TrendingUpIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="4. Track Progress"
              secondary="Save schedules, export to calendar apps, and track your study progress"
            />
          </ListItem>
        </List>
      </Paper>

      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" gutterBottom>
          Ready to optimize your study time?
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/create')}
          sx={{ mt: 2 }}
        >
          Get Started Now
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
