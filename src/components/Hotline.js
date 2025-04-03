import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import CallEndIcon from '@mui/icons-material/CallEnd';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { hotlineService } from '../services/hotlineService';
import { houseRepresentativeService } from '../services/houseRepresentativeService';

/**
 * Hotline component for calling the global hotline number
 */
function Hotline() {
  const [hotlineNumber, setHotlineNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [callId, setCallId] = useState(null);
  const [callStatus, setCallStatus] = useState(null);
  const [activeCalls, setActiveCalls] = useState([]);
  const [callQueue, setCallQueue] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Get the hotline number
    const number = hotlineService.getFormattedHotlineNumber();
    setHotlineNumber(number);

    // Load users
    const loadedUsers = houseRepresentativeService.getUsers();
    setUsers(loadedUsers);

    // Set up interval to update call status and active calls
    const interval = setInterval(() => {
      if (callId) {
        const status = hotlineService.getCallStatus(callId);
        setCallStatus(status);
      }

      const active = hotlineService.getActiveCalls();
      setActiveCalls(active);

      const queue = hotlineService.getCallQueue();
      setCallQueue(queue);
    }, 1000);

    return () => clearInterval(interval);
  }, [callId]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUserId('');
    setUserName('');
    setError('');
  };

  const handleUserSelect = (event) => {
    const selectedUserId = event.target.value;
    setUserId(selectedUserId);

    if (selectedUserId) {
      const user = users.find((u) => u.id === selectedUserId);
      setUserName(user ? user.name : '');
    } else {
      setUserName('');
    }
  };

  const handleStartCall = () => {
    if (!userId) {
      setError('Please select a user');
      return;
    }

    setIsCalling(true);
    setError('');

    try {
      const result = hotlineService.initiateCall(userId);
      setCallId(result.callId);
      setCallStatus(result);
      handleCloseDialog();
    } catch (err) {
      setError('Failed to start call. Please try again.');
    } finally {
      setIsCalling(false);
    }
  };

  const handleEndCall = () => {
    if (!callId) return;

    try {
      hotlineService.endCall(callId);
      setCallId(null);
      setCallStatus(null);
    } catch (err) {
      setError('Failed to end call. Please try again.');
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Global Hotline: {hotlineNumber}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            disabled={isCalling || callId}
          >
            Make Call
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {callStatus && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Current Call Status
            </Typography>

            {callStatus.status === 'connected' ? (
              <>
                <Typography>
                  Connected to: {callStatus.representative.name}
                </Typography>
                <Typography>
                  Duration: {formatDuration(callStatus.duration)}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleEndCall}
                  sx={{ mt: 1 }}
                >
                  End Call
                </Button>
              </>
            ) : (
              <>
                <Typography>
                  Position in queue: {callStatus.position}
                </Typography>
                <Typography>
                  Estimated wait time: {callStatus.estimatedWaitTime} minutes
                </Typography>
              </>
            )}
          </Box>
        )}
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Active Calls
        </Typography>

        <List>
          {activeCalls.map((call) => (
            <ListItem key={call.callId}>
              <ListItemAvatar>
                <Avatar>{users.find((u) => u.id === call.userId)?.name.charAt(0) || '?'}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={users.find((u) => u.id === call.userId)?.name || 'Unknown'}
                secondary={`Connected to: ${call.representative.name}`}
              />
              <Chip
                label={`Duration: ${formatDuration(call.duration)}`}
                color="primary"
                variant="outlined"
              />
            </ListItem>
          ))}
          {activeCalls.length === 0 && (
            <ListItem>
              <ListItemText primary="No active calls" />
            </ListItem>
          )}
        </List>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Call Queue
        </Typography>

        <List>
          {callQueue.map((call) => (
            <ListItem key={call.callId}>
              <ListItemAvatar>
                <Avatar>{users.find((u) => u.id === call.userId)?.name.charAt(0) || '?'}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={users.find((u) => u.id === call.userId)?.name || 'Unknown'}
                secondary={`Position: ${call.position}`}
              />
              <Chip
                label={`Estimated wait: ${call.estimatedWaitTime} minutes`}
                color="secondary"
                variant="outlined"
              />
            </ListItem>
          ))}
          {callQueue.length === 0 && (
            <ListItem>
              <ListItemText primary="No calls in queue" />
            </ListItem>
          )}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Select User
          </Typography>

          <TextField
            select
            fullWidth
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            label="User"
            sx={{ mb: 2 }}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </TextField>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartCall}
              disabled={isCalling || !userId}
            >
              Start Call
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}

export default Hotline;
