import React from 'react';
import { Box, Typography, Button, LinearProgress } from '@mui/material';

function Timer({ timerMode, changeMode, timeLeft, pomodoroCount, pomodoroGoal }) {
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage based on current mode
  const calculateProgress = () => {
    let totalTime;
    if (timerMode === 'pomodoro') {
      totalTime = 25 * 60; // Default to 25 minutes
    } else if (timerMode === 'shortBreak') {
      totalTime = 5 * 60; // Default to 5 minutes
    } else {
      totalTime = 15 * 60; // Default to 15 minutes
    }
    
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Button 
          variant={timerMode === 'pomodoro' ? 'contained' : 'outlined'} 
          onClick={() => changeMode('pomodoro')}
          sx={{ mx: 1 }}
        >
          Pomodoro
        </Button>
        <Button 
          variant={timerMode === 'shortBreak' ? 'contained' : 'outlined'} 
          onClick={() => changeMode('shortBreak')}
          sx={{ mx: 1 }}
        >
          Short Break
        </Button>
        <Button 
          variant={timerMode === 'longBreak' ? 'contained' : 'outlined'} 
          onClick={() => changeMode('longBreak')}
          sx={{ mx: 1 }}
        >
          Long Break
        </Button>
      </Box>
      
      <Typography variant="h1" component="div" sx={{ fontWeight: 'bold', my: 3 }}>
        {formatTime(timeLeft)}
      </Typography>
      
      <LinearProgress 
        variant="determinate" 
        value={calculateProgress()} 
        sx={{ height: 10, borderRadius: 5, mb: 2 }}
      />
      
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        {timerMode === 'pomodoro' ? 'Time to focus!' : 
         timerMode === 'shortBreak' ? 'Take a short break!' : 'Take a long break!'}
      </Typography>
      
      <Typography variant="body2" sx={{ mt: 1 }}>
        Pomodoros: {pomodoroCount} / {pomodoroGoal}
      </Typography>
    </Box>
  );
}

export default Timer;