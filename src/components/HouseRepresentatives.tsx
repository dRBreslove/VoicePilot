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
import { HouseRepresentative, User } from '../models/HouseRepresentative';
import { houseRepresentativeService } from '../services/houseRepresentativeService';
import VoiceRecorder from './VoiceRecorder';

// TabPanel component for tab content
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`representative-tabpanel-${index}`}
      aria-labelledby={`representative-tab-${index}`}
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

const HouseRepresentatives: React.FC = () => {
  const [representatives, setRepresentatives] = useState<HouseRepresentative[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRepresentative, setSelectedRepresentative] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedRepresentativeForVoice, setSelectedRepresentativeForVoice] = useState<HouseRepresentative | null>(null);

  useEffect(() => {
    // Load data on component mount
    setRepresentatives(houseRepresentativeService.getRepresentatives());
    setUsers(houseRepresentativeService.getUsers());
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
      const success = houseRepresentativeService.assignUserToRepresentative(
        selectedUser,
        selectedRepresentative,
      );

      if (success) {
        // Refresh data
        setRepresentatives(houseRepresentativeService.getRepresentatives());
        setUsers(houseRepresentativeService.getUsers());
        handleCloseDialog();
      }
    }
  };

  const handleRemoveUser = (userId: string) => {
    const success = houseRepresentativeService.removeUserFromRepresentative(userId);

    if (success) {
      // Refresh data
      setRepresentatives(houseRepresentativeService.getRepresentatives());
      setUsers(houseRepresentativeService.getUsers());
    }
  };

  const getUserName = (userId: string): string => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleSelectRepresentativeForVoice = (representative: HouseRepresentative) => {
    setSelectedRepresentativeForVoice(representative);
    setSelectedTab(1); // Switch to voice tab
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          House Representatives
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Assign User to Representative
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Representatives" />
          <Tab label="Voice Conversation" />
        </Tabs>
      </Paper>

      <TabPanel value={selectedTab} index={0}>
        <Grid container spacing={3}>
          {representatives.map((representative) => (
            <Grid item xs={12} sm={6} md={4} key={representative.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={representative.avatar || 'https://via.placeholder.com/200'}
                  alt={representative.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                      {representative.name}
                    </Typography>
                    <Chip
                      label={representative.isAvailable ? 'Available' : 'Unavailable'}
                      color={representative.isAvailable ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {representative.email}
                  </Typography>
                  {representative.phone && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {representative.phone}
                    </Typography>
                  )}
                  <Typography variant="body2" paragraph>
                    {representative.bio}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    Assigned Users ({representative.assignedUsers.length}):
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {representative.assignedUsers.length > 0 ? (
                      representative.assignedUsers.map((userId) => (
                        <Chip
                          key={userId}
                          avatar={<Avatar>{getUserName(userId).charAt(0)}</Avatar>}
                          label={getUserName(userId)}
                          onDelete={() => handleRemoveUser(userId)}
                          color="primary"
                          variant="outlined"
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No users assigned
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleSelectRepresentativeForVoice(representative)}
                      disabled={!representative.isAvailable}
                    >
                      Start Voice Conversation
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        {selectedRepresentativeForVoice ? (
          <VoiceRecorder
            representativeId={selectedRepresentativeForVoice.id}
            representativeName={selectedRepresentativeForVoice.name}
            userPhone={selectedRepresentativeForVoice.phone}
          />
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Select a representative to start a voice conversation
            </Typography>
          </Box>
        )}
      </TabPanel>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Assign User to Representative</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="user-select-label">User</InputLabel>
              <Select
                labelId="user-select-label"
                value={selectedUser}
                label="User"
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="representative-select-label">Representative</InputLabel>
              <Select
                labelId="representative-select-label"
                value={selectedRepresentative}
                label="Representative"
                onChange={(e) => setSelectedRepresentative(e.target.value)}
              >
                {representatives
                  .filter((rep) => rep.isAvailable)
                  .map((representative) => (
                    <MenuItem key={representative.id} value={representative.id}>
                      {representative.name}
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
};

export default HouseRepresentatives;
