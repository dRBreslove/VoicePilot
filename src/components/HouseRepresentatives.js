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
  TextField,
  Autocomplete,
} from '@mui/material';
import { houseRepresentativeService, REPRESENTATIVE_TYPES } from '../services/houseRepresentativeService';
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
  const [houses, setHouses] = useState([]);
  const [representatives, setRepresentatives] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRepresentative, setSelectedRepresentative] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedRepresentativeForVoice, setSelectedRepresentativeForVoice] = useState(null);
  const [openAddHouseDialog, setOpenAddHouseDialog] = useState(false);
  const [newHouse, setNewHouse] = useState({ name: '', address: '' });
  const [openAddRepresentativeDialog, setOpenAddRepresentativeDialog] = useState(false);
  const [openEditHouseDialog, setOpenEditHouseDialog] = useState(false);
  const [openEditRepresentativeDialog, setOpenEditRepresentativeDialog] = useState(false);
  const [editingHouse, setEditingHouse] = useState(null);
  const [editingRepresentative, setEditingRepresentative] = useState(null);
  const [newRepresentative, setNewRepresentative] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    avatar: '',
    type: '',
    expertise: [],
  });

  useEffect(() => {
    // Load houses, representatives, and users on component mount
    const loadData = () => {
      const hs = houseRepresentativeService.getHouses();
      const reps = houseRepresentativeService.getRepresentatives();
      const usrs = houseRepresentativeService.getUsers();
      setHouses(hs);
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

  const handleOpenAddHouseDialog = () => {
    setOpenAddHouseDialog(true);
  };

  const handleCloseAddHouseDialog = () => {
    setOpenAddHouseDialog(false);
    setNewHouse({ name: '', address: '' });
  };

  const handleAddHouse = () => {
    if (newHouse.name && newHouse.address) {
      const addedHouse = houseRepresentativeService.addHouse(newHouse);
      setHouses([...houses, addedHouse]);
      handleCloseAddHouseDialog();
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };

  const handleRepresentativeSelect = (representativeId) => {
    const representative = representatives.find((rep) => rep.id === representativeId);
    if (representative) {
      setSelectedRepresentative(representative);
    }
  };

  const handleAssignUser = () => {
    if (selectedUser && selectedRepresentative) {
      houseRepresentativeService.assignUserToRepresentative(selectedUser, selectedRepresentative);

      // Update the representatives list
      const updatedReps = houseRepresentativeService.getRepresentatives(selectedHouse);
      setRepresentatives(updatedReps);

      handleCloseDialog();
    }
  };

  const handleRemoveUser = (userId) => {
    houseRepresentativeService.removeUserFromRepresentative(userId);

    // Update the representatives list
    const updatedReps = houseRepresentativeService.getRepresentatives(selectedHouse);
    setRepresentatives(updatedReps);
  };

  const handleToggleAvailability = (representativeId) => {
    houseRepresentativeService.toggleRepresentativeAvailability(representativeId);

    // Update the representatives list
    const updatedReps = houseRepresentativeService.getRepresentatives(selectedHouse);
    setRepresentatives(updatedReps);
  };

  const handleHouseChange = (event) => {
    const houseId = event.target.value;
    setSelectedHouse(houseId);
    const reps = houseRepresentativeService.getRepresentatives(houseId);
    setRepresentatives(reps);
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

  const handleOpenAddRepresentativeDialog = () => {
    setOpenAddRepresentativeDialog(true);
  };

  const handleCloseAddRepresentativeDialog = () => {
    setOpenAddRepresentativeDialog(false);
    setNewRepresentative({
      name: '',
      email: '',
      phone: '',
      bio: '',
      avatar: '',
      type: '',
      expertise: [],
    });
  };

  const handleAddRepresentative = () => {
    if (newRepresentative.name && newRepresentative.email && selectedHouse) {
      const addedRepresentative = houseRepresentativeService.addRepresentative(newRepresentative, selectedHouse);
      setRepresentatives([...representatives, addedRepresentative]);
      handleCloseAddRepresentativeDialog();
    }
  };

  const handleOpenEditHouseDialog = (house) => {
    setEditingHouse(house);
    setOpenEditHouseDialog(true);
  };

  const handleCloseEditHouseDialog = () => {
    setOpenEditHouseDialog(false);
    setEditingHouse(null);
  };

  const handleEditHouse = () => {
    if (editingHouse) {
      const updatedHouse = houseRepresentativeService.editHouse(editingHouse.id, editingHouse);
      if (updatedHouse) {
        setHouses(houses.map((h) => (h.id === updatedHouse.id ? updatedHouse : h)));
        handleCloseEditHouseDialog();
      }
    }
  };

  const handleDeleteHouse = (houseId) => {
    if (window.confirm('Are you sure you want to delete this house? This will also remove all associated representatives.')) {
      const success = houseRepresentativeService.deleteHouse(houseId);
      if (success) {
        setHouses(houses.filter((h) => h.id !== houseId));
        if (selectedHouse === houseId) {
          setSelectedHouse('');
          setRepresentatives([]);
        }
      }
    }
  };

  const handleOpenEditRepresentativeDialog = (representative) => {
    setEditingRepresentative(representative);
    setOpenEditRepresentativeDialog(true);
  };

  const handleCloseEditRepresentativeDialog = () => {
    setOpenEditRepresentativeDialog(false);
    setEditingRepresentative(null);
  };

  const handleEditRepresentative = () => {
    if (editingRepresentative) {
      const updatedRepresentative = houseRepresentativeService.editRepresentative(
        editingRepresentative.id,
        editingRepresentative,
      );
      if (updatedRepresentative) {
        setRepresentatives(representatives.map((r) =>
          (r.id === updatedRepresentative.id ? updatedRepresentative : r),
        ));
        handleCloseEditRepresentativeDialog();
      }
    }
  };

  const handleDeleteRepresentative = (representativeId) => {
    if (window.confirm('Are you sure you want to delete this representative?')) {
      const success = houseRepresentativeService.deleteRepresentative(representativeId);
      if (success) {
        setRepresentatives(representatives.filter((r) => r.id !== representativeId));
      }
    }
  };

  const getRepresentativeTypeInfo = (typeId) => {
    const foundType = Object.values(REPRESENTATIVE_TYPES).find(
      (type) => type.id === typeId,
    );
    return foundType || REPRESENTATIVE_TYPES.GENERAL;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          House Representatives
        </Typography>

        <Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenAddHouseDialog}
            sx={{ mr: 2 }}
          >
            Add New House
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenAddRepresentativeDialog}
            sx={{ mr: 2 }}
            disabled={!selectedHouse}
          >
            Add Representative
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
          >
            Assign User to Representative
          </Button>
        </Box>
      </Box>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select House</InputLabel>
        <Select
          value={selectedHouse}
          onChange={handleHouseChange}
          label="Select House"
        >
          {houses.map((house) => (
            <MenuItem key={house.id} value={house.id}>
              {house.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedHouse && (
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleOpenEditHouseDialog(houses.find((h) => h.id === selectedHouse))}
          >
            Edit House
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDeleteHouse(selectedHouse)}
          >
            Delete House
          </Button>
        </Box>
      )}

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
                    <Box>
                      <Chip
                        label={getRepresentativeTypeInfo(representative.type).name}
                        icon={<span>{getRepresentativeTypeInfo(representative.type).icon}</span>}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Button
                        size="small"
                        onClick={() => handleOpenEditRepresentativeDialog(representative)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteRepresentative(representative.id)}
                        sx={{ mr: 1 }}
                      >
                        Delete
                      </Button>
                      <Chip
                        label={representative.isAvailable ? 'Available' : 'Busy'}
                        color={representative.isAvailable ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
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

                  {representative.expertise && representative.expertise.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Expertise:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {representative.expertise.map((skill) => (
                          <Chip
                            key={skill}
                            label={skill}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

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
                          onDelete={() => handleRemoveUser(userId)}
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
                      />
                      <Box>
                        <Typography variant="h6">{representative.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {representative.email}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {selectedRepresentativeForVoice && (
            <Box sx={{ mt: 3 }}>
              <VoiceRecorder
                representativeId={selectedRepresentativeForVoice.id}
                representativeName={selectedRepresentativeForVoice.name}
                userPhone={users.find((u) => u.id === selectedRepresentativeForVoice.assignedUsers[0])?.phone}
              />
            </Box>
          )}
        </Box>
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <CircleVisualization representatives={representatives} />
      </TabPanel>

      {/* Assign User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Assign User to Representative</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select User</InputLabel>
            <Select
              value={selectedUser}
              onChange={(e) => handleUserSelect(e.target.value)}
              label="Select User"
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Representative</InputLabel>
            <Select
              value={selectedRepresentative}
              onChange={(e) => handleRepresentativeSelect(e.target.value)}
              label="Select Representative"
            >
              {representatives
                .filter((rep) => rep.isAvailable)
                .map((rep) => (
                  <MenuItem key={rep.id} value={rep.id}>
                    {rep.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAssignUser} variant="contained">
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add House Dialog */}
      <Dialog open={openAddHouseDialog} onClose={handleCloseAddHouseDialog}>
        <DialogTitle>Add New House</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="House Name"
            value={newHouse.name}
            onChange={(e) => setNewHouse({ ...newHouse, name: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Address"
            value={newHouse.address}
            onChange={(e) => setNewHouse({ ...newHouse, address: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddHouseDialog}>Cancel</Button>
          <Button onClick={handleAddHouse} variant="contained">
            Add House
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Representative Dialog */}
      <Dialog open={openAddRepresentativeDialog} onClose={handleCloseAddRepresentativeDialog}>
        <DialogTitle>Add New Representative</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={newRepresentative.name}
            onChange={(e) => setNewRepresentative({ ...newRepresentative, name: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={newRepresentative.email}
            onChange={(e) => setNewRepresentative({ ...newRepresentative, email: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Phone"
            value={newRepresentative.phone}
            onChange={(e) => setNewRepresentative({ ...newRepresentative, phone: e.target.value })}
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Representative Type</InputLabel>
            <Select
              value={newRepresentative.type}
              onChange={(e) => setNewRepresentative({ ...newRepresentative, type: e.target.value })}
              label="Representative Type"
            >
              {Object.values(REPRESENTATIVE_TYPES).map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.icon} {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Bio"
            value={newRepresentative.bio}
            onChange={(e) => setNewRepresentative({ ...newRepresentative, bio: e.target.value })}
            multiline
            rows={3}
            sx={{ mt: 2 }}
          />
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={newRepresentative.expertise}
            onChange={(event, newValue) => {
              setNewRepresentative({ ...newRepresentative, expertise: newValue });
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                  size="small"
                  variant="outlined"
                />
              ))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Expertise (press Enter to add)"
                sx={{ mt: 2 }}
              />
            )}
          />
          <TextField
            fullWidth
            label="Avatar URL (optional)"
            value={newRepresentative.avatar}
            onChange={(e) => setNewRepresentative({ ...newRepresentative, avatar: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddRepresentativeDialog}>Cancel</Button>
          <Button
            onClick={handleAddRepresentative}
            variant="contained"
            disabled={
              !newRepresentative.name
              || !newRepresentative.email
              || !newRepresentative.phone
              || !newRepresentative.type
            }
          >
            Add Representative
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit House Dialog */}
      <Dialog open={openEditHouseDialog} onClose={handleCloseEditHouseDialog}>
        <DialogTitle>Edit House</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="House Name"
            value={editingHouse?.name || ''}
            onChange={(e) => setEditingHouse({ ...editingHouse, name: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Address"
            value={editingHouse?.address || ''}
            onChange={(e) => setEditingHouse({ ...editingHouse, address: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditHouseDialog}>Cancel</Button>
          <Button
            onClick={handleEditHouse}
            variant="contained"
            disabled={!editingHouse?.name || !editingHouse?.address}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Representative Dialog */}
      <Dialog open={openEditRepresentativeDialog} onClose={handleCloseEditRepresentativeDialog}>
        <DialogTitle>Edit Representative</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={editingRepresentative?.name || ''}
            onChange={(e) => setEditingRepresentative({ ...editingRepresentative, name: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            value={editingRepresentative?.email || ''}
            onChange={(e) => setEditingRepresentative({ ...editingRepresentative, email: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Phone"
            value={editingRepresentative?.phone || ''}
            onChange={(e) => setEditingRepresentative({ ...editingRepresentative, phone: e.target.value })}
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Representative Type</InputLabel>
            <Select
              value={editingRepresentative?.type || ''}
              onChange={(e) => setEditingRepresentative({ ...editingRepresentative, type: e.target.value })}
              label="Representative Type"
            >
              {Object.values(REPRESENTATIVE_TYPES).map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.icon} {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Bio"
            value={editingRepresentative?.bio || ''}
            onChange={(e) => setEditingRepresentative({ ...editingRepresentative, bio: e.target.value })}
            multiline
            rows={3}
            sx={{ mt: 2 }}
          />
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={editingRepresentative?.expertise || []}
            onChange={(event, newValue) => {
              setEditingRepresentative({ ...editingRepresentative, expertise: newValue });
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                  size="small"
                  variant="outlined"
                />
              ))}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Expertise (press Enter to add)"
                sx={{ mt: 2 }}
              />
            )}
          />
          <TextField
            fullWidth
            label="Avatar URL (optional)"
            value={editingRepresentative?.avatar || ''}
            onChange={(e) => setEditingRepresentative({ ...editingRepresentative, avatar: e.target.value })}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditRepresentativeDialog}>Cancel</Button>
          <Button
            onClick={handleEditRepresentative}
            variant="contained"
            disabled={
              !editingRepresentative?.name
              || !editingRepresentative?.email
              || !editingRepresentative?.phone
              || !editingRepresentative?.type
            }
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default HouseRepresentatives;
