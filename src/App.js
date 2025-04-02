import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import HouseRepresentatives from './components/HouseRepresentatives';
import Hotline from './components/Hotline';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

/**
 * TabPanel component for tab content
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.children] - Child elements
 * @param {number} props.index - Tab index
 * @param {number} props.value - Current tab value
 */
function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

/**
 * App component - Main application component
 */
function App() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              VoicePilot - Azure Copilot House
            </Typography>
          </Toolbar>
        </AppBar>

        <Paper sx={{ width: '100%', mb: 2, mt: 2 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="House Representatives" />
            <Tab label="Global Hotline" />
          </Tabs>
        </Paper>

        <TabPanel value={selectedTab} index={0}>
          <HouseRepresentatives />
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <Hotline />
        </TabPanel>
      </Container>
    </ThemeProvider>
  );
}

export default App;
