import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import MicIcon from '@mui/icons-material/Mic';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { speechService } from './services/speechService';
import { cognitiveService } from './services/cognitiveService';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0078d4',
    },
    secondary: {
      main: '#2b88d8',
    },
    background: {
      default: '#1a1a1a',
      paper: '#2d2d2d',
    },
  },
});

function App(): JSX.Element {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleStartListening = async (): Promise<void> => {
    setError(null);
    setIsListening(true);
    try {
      await speechService.startListening(
        async (text: string) => {
          setTranscript(text);
          const result = await cognitiveService.processCommand(text);
          setResponse(result);
        },
        (errorMessage: string) => {
          setError(errorMessage);
          setIsListening(false);
        },
      );
    } catch (err) {
      setError('Failed to start speech recognition');
      setIsListening(false);
    }
  };

  const handleStopListening = async (): Promise<void> => {
    try {
      await speechService.stopListening();
      setIsListening(false);
    } catch (err) {
      setError('Failed to stop speech recognition');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom>
              VoicePilot
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Your Azure Copilot at Home
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            )}

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                width: '100%',
              }}
            >
              <IconButton
                color={isListening ? 'secondary' : 'primary'}
                onClick={isListening ? handleStopListening : handleStartListening}
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: isListening ? 'rgba(43, 136, 216, 0.1)' : 'rgba(0, 120, 212, 0.1)',
                }}
              >
                {isListening ? (
                  <CircularProgress size={40} color="secondary" />
                ) : (
                  <MicIcon sx={{ fontSize: 40 }} />
                )}
              </IconButton>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  width: '100%',
                  minHeight: 100,
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  {transcript || 'Your voice input will appear here...'}
                </Typography>
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  width: '100%',
                  minHeight: 100,
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  {response || 'Azure Copilot responses will appear here...'}
                </Typography>
              </Paper>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
