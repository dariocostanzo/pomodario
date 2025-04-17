import "./App.css";

import { Box, Container, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Controls from "./components/Controls";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./components/Header";
import Settings from "./components/Settings";
import Stats from "./components/Stats";
import TaskList from "./components/TaskList";
import Timer from "./components/Timer";

function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  // Timer settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("pomoDarioSettings");
    return saved
      ? JSON.parse(saved)
      : {
          pomodoroTime: 25,
          shortBreakTime: 5,
          longBreakTime: 15,
          pomodoroGoal: 4,
          autoStartBreaks: true,
          autoStartPomodoros: true,
          alarmSound: "bell",
          alarmVolume: 0.7,
        };
  });

  // Timer state
  const [timerMode, setTimerMode] = useState("pomodoro");
  const [timeLeft, setTimeLeft] = useState(settings.pomodoroTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Pomodoro counter
  const [pomodoroCount, setPomodoroCount] = useState(0);

  // Tasks state
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("pomoDarioTasks");
    return saved ? JSON.parse(saved) : [];
  });

  // Stats state
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem("pomoDarioStats");
    return saved
      ? JSON.parse(saved)
      : {
          completedPomodoros: 0,
          totalFocusTime: 0,
          dailyPomodoros: {},
        };
  });

  // Settings dialog state
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Stats dialog state
  const [statsOpen, setStatsOpen] = useState(false);

  // Create theme based on dark mode preference
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main:
          timerMode === "pomodoro"
            ? "#DB524D"
            : timerMode === "shortBreak"
            ? "#4C9195"
            : "#457CA3",
      },
      background: {
        default: darkMode
          ? "#121212"
          : timerMode === "pomodoro"
          ? "#FFF5F5"
          : timerMode === "shortBreak"
          ? "#F0F9FA"
          : "#F0F5FA",
        paper: darkMode ? "#1E1E1E" : "#FFFFFF",
      },
    },
  });

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("pomoDarioSettings", JSON.stringify(settings));
  }, [settings]);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("pomoDarioTasks", JSON.stringify(tasks));
  }, [tasks]);

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem("pomoDarioStats", JSON.stringify(stats));
  }, [stats]);

  // Timer logic
  useEffect(() => {
    let interval = null;

    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer complete
      clearInterval(interval);
      playAlarmSound();

      if (timerMode === "pomodoro") {
        // Update stats
        const newStats = {
          ...stats,
          completedPomodoros: stats.completedPomodoros + 1,
          totalFocusTime: stats.totalFocusTime + settings.pomodoroTime * 60,
        };

        // Update daily stats
        const today = new Date().toISOString().split("T")[0];
        newStats.dailyPomodoros = {
          ...newStats.dailyPomodoros,
          [today]: (newStats.dailyPomodoros[today] || 0) + 1,
        };

        setStats(newStats);

        // Increment pomodoro count
        const newCount = pomodoroCount + 1;
        setPomodoroCount(newCount);

        // Check if it's time for a long break
        if (newCount % settings.pomodoroGoal === 0) {
          setTimerMode("longBreak");
          setTimeLeft(settings.longBreakTime * 60);

          // Auto start break if enabled
          if (settings.autoStartBreaks) {
            setIsActive(true);
            setIsPaused(false);
          } else {
            setIsActive(false);
          }
        } else {
          setTimerMode("shortBreak");
          setTimeLeft(settings.shortBreakTime * 60);

          // Auto start break if enabled
          if (settings.autoStartBreaks) {
            setIsActive(true);
            setIsPaused(false);
          } else {
            setIsActive(false);
          }
        }
      } else {
        // Break is over, back to pomodoro
        setTimerMode("pomodoro");
        setTimeLeft(settings.pomodoroTime * 60);

        // Auto start pomodoro if enabled
        if (settings.autoStartPomodoros) {
          setIsActive(true);
          setIsPaused(false);
        } else {
          setIsActive(false);
        }
      }
    }

    return () => clearInterval(interval);
  }, [
    isActive,
    isPaused,
    timeLeft,
    timerMode,
    settings,
    pomodoroCount,
    stats,
    playAlarmSound,
  ]);

  // Change timer mode
  const changeMode = (mode) => {
    if (isActive) {
      if (!window.confirm("Timer is running. Do you want to switch modes?")) {
        return;
      }
      setIsActive(false);
    }

    setTimerMode(mode);

    if (mode === "pomodoro") {
      setTimeLeft(settings.pomodoroTime * 60);
    } else if (mode === "shortBreak") {
      setTimeLeft(settings.shortBreakTime * 60);
    } else {
      setTimeLeft(settings.longBreakTime * 60);
    }
  };

  // Start or pause timer
  const toggleTimer = () => {
    if (isActive) {
      setIsPaused(true);
      setIsActive(false);
    } else {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);

    if (timerMode === "pomodoro") {
      setTimeLeft(settings.pomodoroTime * 60);
    } else if (timerMode === "shortBreak") {
      setTimeLeft(settings.shortBreakTime * 60);
    } else {
      setTimeLeft(settings.longBreakTime * 60);
    }
  };

  // Play alarm sound
  const playAlarmSound = () => {
    const audio = new Audio(`/sounds/${settings.alarmSound}.wav`);
    audio.volume = settings.alarmVolume;
    audio.play().catch((error) => console.log("Error playing sound:", error));

    // Show notification if permission granted
    if ("Notification" in window && Notification.permission === "granted") {
      let message = "";

      if (timerMode === "pomodoro") {
        message = "Pomodoro complete! Time for a break.";
      } else {
        message = "Break complete! Time to focus.";
      }

      new Notification("PomoDario", {
        body: message,
        icon: "/logo192.png",
      });
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Add a new task
  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now() }]);
  };

  // Update a task
  const updateTask = (id, updates) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Open settings dialog
  const openSettings = () => {
    setSettingsOpen(true);
  };

  // Close settings dialog
  const closeSettings = () => {
    setSettingsOpen(false);
  };

  // Save settings
  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    closeSettings();

    // Update timer if needed
    if (timerMode === "pomodoro") {
      setTimeLeft(newSettings.pomodoroTime * 60);
    } else if (timerMode === "shortBreak") {
      setTimeLeft(newSettings.shortBreakTime * 60);
    } else {
      setTimeLeft(newSettings.longBreakTime * 60);
    }
  };

  // Open stats dialog
  const openStats = () => {
    setStatsOpen(true);
  };

  // Close stats dialog
  const closeStats = () => {
    setStatsOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Header
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            openSettings={openSettings}
            openStats={openStats}
          />

          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}
          >
            <Timer
              timerMode={timerMode}
              changeMode={changeMode}
              timeLeft={timeLeft}
              pomodoroCount={pomodoroCount}
              pomodoroGoal={settings.pomodoroGoal}
            />

            <Controls
              isActive={isActive}
              toggleTimer={toggleTimer}
              resetTimer={resetTimer}
            />
          </Paper>

          <Box sx={{ mt: 4 }}>
            <TaskList
              tasks={tasks}
              addTask={addTask}
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
          </Box>
        </Box>

        <Settings
          open={settingsOpen}
          onClose={closeSettings}
          settings={settings}
          onSave={saveSettings}
        />

        <Stats open={statsOpen} onClose={closeStats} stats={stats} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
