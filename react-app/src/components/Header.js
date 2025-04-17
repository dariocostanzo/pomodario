import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';

function Header({ darkMode, toggleDarkMode, openSettings, openStats }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
      <Typography variant="h4" component="h1" fontWeight="bold">
        PomoDario
      </Typography>
      
      <Box>
        <Tooltip title="Statistics">
          <IconButton onClick={openStats} color="inherit">
            <BarChartIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Settings">
          <IconButton onClick={openSettings} color="inherit">
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title={darkMode ? "Light mode" : "Dark mode"}>
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default Header;