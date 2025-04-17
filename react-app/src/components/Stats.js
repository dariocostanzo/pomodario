import React, { useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Paper, Grid
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Stats({ open, onClose, stats }) {
  // Format time from seconds to hours and minutes
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Prepare chart data for the last 7 days
  const chartData = useMemo(() => {
    const today = new Date();
    const labels = [];
    const data = [];
    
    // Generate labels for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Format date as "Mon", "Tue", etc.
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      labels.push(dayName);
      
      // Get pomodoro count for this day
      data.push(stats.dailyPomodoros[dateString] || 0);
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Pomodoros',
          data,
          backgroundColor: 'rgba(219, 82, 77, 0.7)',
          borderColor: 'rgba(219, 82, 77, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [stats.dailyPomodoros]);

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Daily Pomodoros',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Calculate today's pomodoros
  const todayPomodoros = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return stats.dailyPomodoros[today] || 0;
  }, [stats.dailyPomodoros]);

  // Calculate this week's pomodoros
  const weekPomodoros = useMemo(() => {
    const today = new Date();
    let weekTotal = 0;
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      weekTotal += stats.dailyPomodoros[dateString] || 0;
    }
    
    return weekTotal;
  }, [stats.dailyPomodoros]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Your Statistics</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Summary stats */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Paper elevation={2} sx={{ p: 2, flex: 1, mx: 1, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {stats.completedPomodoros}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Pomodoros
                </Typography>
              </Paper>
              
              <Paper elevation={2} sx={{ p: 2, flex: 1, mx: 1, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {formatTime(stats.totalFocusTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Focus Time
                </Typography>
              </Paper>
              
              <Paper elevation={2} sx={{ p: 2, flex: 1, mx: 1, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {todayPomodoros}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Today's Pomodoros
                </Typography>
              </Paper>
              
              <Paper elevation={2} sx={{ p: 2, flex: 1, mx: 1, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {weekPomodoros}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This Week's Pomodoros
                </Typography>
              </Paper>
            </Box>
          </Grid>
          
          {/* Chart */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Bar data={chartData} options={chartOptions} height={80} />
            </Paper>
          </Grid>
          
          {/* Achievements section */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Achievements
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                {stats.completedPomodoros >= 1 && (
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center', width: 150 }}>
                    <Typography variant="subtitle2" color="primary">First Pomodoro</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed your first pomodoro
                    </Typography>
                  </Paper>
                )}
                
                {stats.completedPomodoros >= 10 && (
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center', width: 150 }}>
                    <Typography variant="subtitle2" color="primary">Getting Started</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed 10 pomodoros
                    </Typography>
                  </Paper>
                )}
                
                {stats.completedPomodoros >= 50 && (
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center', width: 150 }}>
                    <Typography variant="subtitle2" color="primary">Focus Master</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed 50 pomodoros
                    </Typography>
                  </Paper>
                )}
                
                {stats.completedPomodoros >= 100 && (
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center', width: 150 }}>
                    <Typography variant="subtitle2" color="primary">Pomodoro Pro</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed 100 pomodoros
                    </Typography>
                  </Paper>
                )}
                
                {todayPomodoros >= 8 && (
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center', width: 150 }}>
                    <Typography variant="subtitle2" color="primary">Productive Day</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed 8 pomodoros in a day
                    </Typography>
                  </Paper>
                )}
                
                {weekPomodoros >= 25 && (
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center', width: 150 }}>
                    <Typography variant="subtitle2" color="primary">Productive Week</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed 25 pomodoros in a week
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Stats;