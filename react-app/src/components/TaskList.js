import React, { useState } from 'react';
import { 
  Box, Paper, Typography, List, ListItem, ListItemText, 
  ListItemIcon, ListItemSecondaryAction, IconButton, 
  TextField, Button, Checkbox, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

function TaskList({ tasks, addTask, updateTask, deleteTask }) {
  const [newTaskText, setNewTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTask({
        text: newTaskText,
        completed: false,
        createdAt: new Date().toISOString()
      });
      setNewTaskText('');
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const handleSaveEdit = () => {
    if (editingTaskText.trim()) {
      updateTask(editingTaskId, { text: editingTaskText });
    }
    setEditingTaskId(null);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  const handleToggleComplete = (id, completed) => {
    updateTask(id, { completed: !completed });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Tasks
      </Typography>
      
      <Box sx={{ display: 'flex', mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add a new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          size="small"
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTask}
          sx={{ ml: 1 }}
        >
          Add
        </Button>
      </Box>
      
      {tasks.length > 0 ? (
        <List>
          {tasks.map((task, index) => (
            <React.Fragment key={task.id}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task.id, task.completed)}
                  />
                </ListItemIcon>
                
                {editingTaskId === task.id ? (
                  <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      value={editingTaskText}
                      onChange={(e) => setEditingTaskText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                      size="small"
                      autoFocus
                    />
                    <IconButton onClick={handleSaveEdit} size="small" sx={{ ml: 1 }}>
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={handleCancelEdit} size="small">
                      <CancelIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <ListItemText
                      primary={task.text}
                      sx={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'text.secondary' : 'text.primary'
                      }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleEditTask(task)} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => deleteTask(task.id)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </>
                )}
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          No tasks yet. Add a task to get started!
        </Typography>
      )}
    </Paper>
  );
}

export default TaskList;