import React from 'react';
import { Box, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

function Controls({ isActive, toggleTimer, resetTimer }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Button
        variant="contained"
        size="large"
        startIcon={isActive ? <PauseIcon /> : <PlayArrowIcon />}
        onClick={toggleTimer}
        sx={{ mx: 1, px: 4, py: 1.5 }}
      >
        {isActive ? 'PAUSE' : 'START'}
      </Button>
      
      <Button
        variant="outlined"
        size="large"
        startIcon={<RestartAltIcon />}
        onClick={resetTimer}
        sx={{ mx: 1 }}
      >
        RESET
      </Button>
    </Box>
  );
}

export default Controls;