import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControlLabel, Switch,
  FormControl, InputLabel, Select, MenuItem,
  Slider, Typography, Box, Grid
} from '@mui/material';

function Settings({ open, onClose, settings, onSave }) {
  const [localSettings, setLocalSettings] = useState({ ...settings });

  const handleChange = (field, value) => {
    setLocalSettings({
      ...localSettings,
      [field]: value
    });
  };

  const handleSave = () => {
    onSave(localSettings);
  };

  const handleCancel = () => {
    setLocalSettings({ ...settings });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Pomodoro (minutes)"
              type="number"
              value={localSettings.pomodoroTime}
              onChange={(e) => handleChange('pomodoroTime', parseInt(e.target.value) || 1)}
              inputProps={{ min: 1, max: 60 }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Short Break (minutes)"
              type="number"
              value={localSettings.shortBreakTime}
              onChange={(e) => handleChange('shortBreakTime', parseInt(e.target.value) || 1)}
              inputProps={{ min: 1, max: 30 }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Long Break (minutes)"
              type="number"
              value={localSettings.longBreakTime}
              onChange={(e) => handleChange('longBreakTime', parseInt(e.target.value) || 1)}
              inputProps={{ min: 1, max: 60 }}
              fullWidth
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Pomodoros until long break"
              type="number"
              value={localSettings.pomodoroGoal}
              onChange={(e) => handleChange('pomodoroGoal', parseInt(e.target.value) || 1)}
              inputProps={{ min: 1, max: 10 }}
              fullWidth
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.autoStartBreaks}
                  onChange={(e) => handleChange('autoStartBreaks', e.target.checked)}
                />
              }
              label="Auto-start breaks"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={localSettings.autoStartPomodoros}
                  onChange={(e) => handleChange('autoStartPomodoros', e.target.checked)}
                />
              }
              label="Auto-start pomodoros"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Alarm Sound</InputLabel>
              <Select
                value={localSettings.alarmSound}
                onChange={(e) => handleChange('alarmSound', e.target.value)}
                label="Alarm Sound"
              >
                <MenuItem value="bell">Bell</MenuItem>
                <MenuItem value="digital">Digital</MenuItem>
                <MenuItem value="kitchen">Kitchen Timer</MenuItem>
                <MenuItem value="bird">Bird</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Typography gutterBottom>Alarm Volume</Typography>
            <Slider
              value={localSettings.alarmVolume}
              onChange={(_, value) => handleChange('alarmVolume', value)}
              min={0}
              max={1}
              step={0.1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Settings;