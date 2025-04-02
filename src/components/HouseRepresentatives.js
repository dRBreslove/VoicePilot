import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { houseRepresentativeService } from '../services/houseRepresentativeService';
import VoiceRecorder from './VoiceRecorder';
import CircleVisualization from './CircleVisualization';

/**
 * TabPanel component for tab content
 * @param {Object} props - Component props
 * @param {React.ReactNode} [props.children] - Child elements
 * @param {number} props.index - Tab index
 * @param {number} props.value - Current tab value
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

/**
 * HouseRepresentatives component for managing house representatives
 */
function HouseRepresentatives() {
  const [representatives, setRepresentatives] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRepresentative, setSelectedRepresentative] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedRepresentativeForVoice, setSelectedRepresentativeForVoice] = useState(null);

  useEffect(() => {
    // Load representatives and users on component mount
    const loadData = () => {
      const reps = houseRepresentativeService.getRepresentatives();
      const usrs = houseRepresentativeService.getUsers();
      setRepresentatives(reps);
      setUsers(usrs);
    };

    loadData();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser('');
    setSelectedRepresentative('');
  };

  const handleAssignUser = () => {
    if (selectedUser && selectedRepresentative) {
      houseRepresentativeService.assignUserToRepresentative(selectedUser, selectedRepresentative);

      // Update the representatives list
      const updatedReps = houseRepresentativeService.getRepresentatives();
      setRepresentatives(updatedReps);

      handleCloseDialog();
    }
  };

  const handleRemoveUser = (userId, representativeId) => {
    houseRepresentativeService.removeUserFromRepresentative(userId);

    // Update the representatives list
    const updatedReps = houseRepresentativeService.getRepresentatives();
    setRepresentatives(updatedReps);
  };

  const handleToggleAvailability = (representativeId) => {
    houseRepresentativeService.toggleRepresentativeAvailability(representativeId);

    // Update the representatives list
    const updatedReps = houseRepresentativeService.getRepresentatives();
    setRepresentatives(updatedReps);
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSelectRepresentativeForVoice = (representative) => {
    setSelectedRepresentativeForVoice(representative);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          House Representatives
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
        >
          Assign User to Representative
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Representatives" />
          <Tab label="Voice Conversations" />
          <Tab label="Circles & Networks" />
        </Tabs>
      </Paper>

      <TabPanel value={selectedTab} index={0}>
        <Grid container spacing={3}>
          {representatives.map((representative) => (
            <Grid item xs={12} sm={6} md={4} key={representative.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={representative.avatar || 'https://via.placeholder.com/300x140?text=Representative'}
                  alt={representative.name}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="div">
                      {representative.name}
                    </Typography>
                    <Chip
                      label={representative.isAvailable ? 'Available' : 'Busy'}
                      color={representative.isAvailable ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {representative.email}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {representative.phone}
                  </Typography>

                  <Typography variant="body2" paragraph>
                    {representative.bio}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">
                      Assigned Users:
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => handleToggleAvailability(representative.id)}
                    >
                      {representative.isAvailable ? 'Set Busy' : 'Set Available'}
                    </Button>
                  </Box>

                  {representative.assignedUsers.length > 0 ? (
                    <Box>
                      {representative.assignedUsers.map((userId) => (
                        <Chip
                          key={userId}
                          label={getUserName(userId)}
                          onDelete={() => handleRemoveUser(userId, representative.id)}
                          sx={{ m: 0.5 }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No assigned users
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Select a Representative for Voice Conversation
          </Typography>

          <Grid container spacing={2}>
            {representatives.map((representative) => (
              <Grid item xs={12} sm={6} md={4} key={representative.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: selectedRepresentativeForVoice?.id === representative.id ? '2px solid #1976d2' : 'none',
                  }}
                  onClick={() => handleSelectRepresentativeForVoice(representative)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={representative.avatar}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      >
                        {representative.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {representative.name}
                        </Typography>
                        <Chip
                          label={representative.isAvailable ? 'Available' : 'Busy'}
                          color={representative.isAvailable ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {selectedRepresentativeForVoice && (
          <VoiceRecorder
            representativeId={selectedRepresentativeForVoice.id}
            representativeName={selectedRepresentativeForVoice.name}
          />
        )}
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Select a Representative to View Circles
          </Typography>

          <Grid container spacing={2}>
            {representatives.map((representative) => (
              <Grid item xs={12} sm={6} md={4} key={representative.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: selectedRepresentativeForVoice?.id === representative.id ? '2px solid #1976d2' : 'none',
                  }}
                  onClick={() => handleSelectRepresentativeForVoice(representative)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={representative.avatar}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      >
                        {representative.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {representative.name}
                        </Typography>
                        <Chip
                          label={representative.isAvailable ? 'Available' : 'Busy'}
                          color={representative.isAvailable ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {selectedRepresentativeForVoice && (
          <CircleVisualization representativeId={selectedRepresentativeForVoice.id} />
        )}
      </TabPanel>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Assign User to Representative</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>User</InputLabel>
              <Select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                label="User"
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Representative</InputLabel>
              <Select
                value={selectedRepresentative}
                onChange={(e) => setSelectedRepresentative(e.target.value)}
                label="Representative"
              >
                {representatives.map((representative) => (
                  <MenuItem key={representative.id} value={representative.id}>
                    {representative.name} ({representative.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleAssignUser}
            variant="contained"
            color="primary"
            disabled={!selectedUser || !selectedRepresentative}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default HouseRepresentatives;
