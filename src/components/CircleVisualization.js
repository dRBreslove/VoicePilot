import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import { circleService } from '../services/circleService';
import { houseRepresentativeService } from '../services/houseRepresentativeService';

/**
 * CircleVisualization component for displaying circles and circles of circles
 * @param {Object} props - Component props
 * @param {string} props.representativeId - The ID of the representative
 */
function CircleVisualization({ representativeId }) {
  const [circles, setCircles] = useState([]);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openSubCircleDialog, setOpenSubCircleDialog] = useState(false);
  const [newCircleName, setNewCircleName] = useState('');
  const [newCircleDescription, setNewCircleDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [availableRepresentatives, setAvailableRepresentatives] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const loadCircles = useCallback(() => {
    try {
      const circleHierarchy = circleService.getCircleHierarchy(representativeId);
      setCircles(circleHierarchy);
    } catch (err) {
      setError('Failed to load circles. Please try again.');
    }
  }, [representativeId]);

  const loadAvailableMembers = useCallback(() => {
    try {
      const users = houseRepresentativeService.getUsers();
      setAvailableUsers(users);

      const representatives = houseRepresentativeService.getRepresentatives()
        .filter((rep) => rep.id !== representativeId);
      setAvailableRepresentatives(representatives);
    } catch (err) {
      setError('Failed to load available members. Please try again.');
    }
  }, [representativeId]);

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
    setNewCircleName('');
    setNewCircleDescription('');
    setSelectedMembers([]);
    setError('');
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleOpenSubCircleDialog = (circle) => {
    setSelectedCircle(circle);
    setOpenSubCircleDialog(true);
    setNewCircleName('');
    setNewCircleDescription('');
    setSelectedMembers([]);
    setError('');
  };

  const handleCloseSubCircleDialog = () => {
    setOpenSubCircleDialog(false);
    setSelectedCircle(null);
  };

  const handleCreateCircle = () => {
    if (!newCircleName.trim()) {
      setError('Please enter a circle name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      circleService.createCircle(
        representativeId,
        newCircleName,
        newCircleDescription,
        selectedMembers,
      );

      loadCircles();
      handleCloseCreateDialog();
    } catch (err) {
      console.error('Error creating circle:', err);
      setError('Failed to create circle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubCircle = () => {
    if (!newCircleName.trim()) {
      setError('Please enter a circle name');
      return;
    }

    if (!selectedCircle) {
      setError('No parent circle selected');
      return;
    }

    setLoading(true);
    setError('');

    try {
      circleService.createSubCircle(
        selectedCircle.id,
        representativeId,
        newCircleName,
        newCircleDescription,
        selectedMembers,
      );

      loadCircles();
      handleCloseSubCircleDialog();
    } catch (err) {
      console.error('Error creating sub-circle:', err);
      setError('Failed to create sub-circle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMemberSelect = (event) => {
    setSelectedMembers(event.target.value);
  };

  const handleCircleClick = (circle) => {
    setSelectedCircle(circle);
  };

  const drawCircles = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    // Set up drawing parameters
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;
    const maxRadius = Math.min(centerX, centerY) * 0.8;

    // Draw circles recursively
    const drawCircleHierarchy = (circle, level, index, total, parentX, parentY, parentRadius) => {
      // Calculate position
      let x, y, radius;

      if (level === 0) {
        // Root level - draw in the center
        x = centerX;
        y = centerY;
        radius = maxRadius * 0.3;
      } else {
        // Calculate position based on parent and index
        const angle = (2 * Math.PI * index) / total;
        const distance = parentRadius * 0.7;
        x = parentX + distance * Math.cos(angle);
        y = parentY + distance * Math.sin(angle);
        radius = parentRadius * 0.5;
      }

      // Draw circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);

      // Set style based on selection
      if (selectedCircle && selectedCircle.id === circle.id) {
        ctx.fillStyle = 'rgba(25, 118, 210, 0.3)';
        ctx.strokeStyle = '#1976d2';
        ctx.lineWidth = 3;
      } else {
        ctx.fillStyle = 'rgba(25, 118, 210, 0.1)';
        ctx.strokeStyle = '#1976d2';
        ctx.lineWidth = 2;
      }

      ctx.fill();
      ctx.stroke();

      // Draw circle name
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(circle.name, x, y);

      // Draw sub-circles
      if (circle.subCircles && circle.subCircles.length > 0) {
        circle.subCircles.forEach((subCircle, i) => {
          drawCircleHierarchy(subCircle, level + 1, i, circle.subCircles.length, x, y, radius);
        });
      }
    };

    // Draw all root circles
    circles.forEach((circle, i) => {
      drawCircleHierarchy(circle, 0, i, circles.length, 0, 0, 0);
    });
  }, [canvasSize, circles, selectedCircle]);

  useEffect(() => {
    // Load circles for the representative
    loadCircles();

    // Load available users and representatives
    loadAvailableMembers();

    // Set up canvas size
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width, height });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [loadCircles, loadAvailableMembers]);

  useEffect(() => {
    // Draw circles on canvas when circles or canvas size changes
    if (canvasRef.current && circles.length > 0) {
      drawCircles();
    }
  }, [circles, canvasSize, selectedCircle, drawCircles]);

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Circles & Networks
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
          >
            Create Circle
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          ref={canvasRef}
          sx={{
            width: '100%',
            height: 500,
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <canvas
            width={canvasSize.width}
            height={canvasSize.height}
            style={{ width: '100%', height: '100%' }}
          />
        </Box>
      </Paper>

      {selectedCircle && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">
              {selectedCircle.name}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenSubCircleDialog(selectedCircle)}
            >
              Create Sub-Circle
            </Button>
          </Box>

          <Typography variant="body1" paragraph>
            {selectedCircle.description || 'No description provided.'}
          </Typography>

          <Typography variant="h6" gutterBottom>
            Members
          </Typography>

          <List>
            {selectedCircle.members.map((memberId, index) => {
              // Find member in users or representatives
              const user = availableUsers.find((u) => u.id === memberId);
              const representative = availableRepresentatives.find((r) => r.id === memberId);
              const member = user || representative;

              return (
                <React.Fragment key={memberId}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>
                        {member ? member.name.charAt(0) : '?'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={member ? member.name : 'Unknown Member'}
                      secondary={member ? (user ? 'User' : 'Representative') : ''}
                    />
                    {memberId !== selectedCircle.createdBy && (
                      <Chip
                        label={user ? 'User' : 'Representative'}
                        color={user ? 'primary' : 'secondary'}
                        size="small"
                      />
                    )}
                  </ListItem>
                  {index < selectedCircle.members.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              );
            })}
          </List>

          {selectedCircle.subCircles && selectedCircle.subCircles.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Sub-Circles
              </Typography>

              <List>
                {selectedCircle.subCircles.map((subCircle, index) => (
                  <React.Fragment key={subCircle.id}>
                    <ListItem
                      alignItems="flex-start"
                      button
                      onClick={() => handleCircleClick(subCircle)}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <GroupIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={subCircle.name}
                        secondary={`${subCircle.members.length} members`}
                      />
                      <Chip
                        label={`${subCircle.subCircles ? subCircle.subCircles.length : 0} sub-circles`}
                        color="info"
                        size="small"
                      />
                    </ListItem>
                    {index < selectedCircle.subCircles.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </>
          )}
        </Paper>
      )}

      {/* Create Circle Dialog */}
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
        <DialogTitle>Create New Circle</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Circle Name"
              value={newCircleName}
              onChange={(e) => setNewCircleName(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Description"
              value={newCircleDescription}
              onChange={(e) => setNewCircleDescription(e.target.value)}
              multiline
              rows={3}
            />

            <FormControl fullWidth>
              <InputLabel>Members</InputLabel>
              <Select
                multiple
                value={selectedMembers}
                onChange={handleMemberSelect}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const user = availableUsers.find((u) => u.id === value);
                      const representative = availableRepresentatives.find((r) => r.id === value);
                      const member = user || representative;
                      return (
                        <Chip
                          key={value}
                          label={member ? member.name : 'Unknown'}
                          size="small"
                        />
                      );
                    })}
                  </Box>
                )}
              >
                <MenuItem value="" disabled>
                  <em>Select members</em>
                </MenuItem>

                <MenuItem disabled>
                  <Typography variant="subtitle2">Users</Typography>
                </MenuItem>

                {availableUsers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user.name} secondary={user.email} />
                  </MenuItem>
                ))}

                <Divider />

                <MenuItem disabled>
                  <Typography variant="subtitle2">Representatives</Typography>
                </MenuItem>

                {availableRepresentatives.map((representative) => (
                  <MenuItem key={representative.id} value={representative.id}>
                    <ListItemAvatar>
                      <Avatar src={representative.avatar}>
                        {representative.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={representative.name} secondary={representative.email} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button
            onClick={handleCreateCircle}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Sub-Circle Dialog */}
      <Dialog open={openSubCircleDialog} onClose={handleCloseSubCircleDialog}>
        <DialogTitle>Create Sub-Circle in {selectedCircle?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Circle Name"
              value={newCircleName}
              onChange={(e) => setNewCircleName(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Description"
              value={newCircleDescription}
              onChange={(e) => setNewCircleDescription(e.target.value)}
              multiline
              rows={3}
            />

            <FormControl fullWidth>
              <InputLabel>Members</InputLabel>
              <Select
                multiple
                value={selectedMembers}
                onChange={handleMemberSelect}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const user = availableUsers.find((u) => u.id === value);
                      const representative = availableRepresentatives.find((r) => r.id === value);
                      const member = user || representative;
                      return (
                        <Chip
                          key={value}
                          label={member ? member.name : 'Unknown'}
                          size="small"
                        />
                      );
                    })}
                  </Box>
                )}
              >
                <MenuItem value="" disabled>
                  <em>Select members</em>
                </MenuItem>

                <MenuItem disabled>
                  <Typography variant="subtitle2">Users</Typography>
                </MenuItem>

                {availableUsers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user.name} secondary={user.email} />
                  </MenuItem>
                ))}

                <Divider />

                <MenuItem disabled>
                  <Typography variant="subtitle2">Representatives</Typography>
                </MenuItem>

                {availableRepresentatives.map((representative) => (
                  <MenuItem key={representative.id} value={representative.id}>
                    <ListItemAvatar>
                      <Avatar src={representative.avatar}>
                        {representative.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={representative.name} secondary={representative.email} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubCircleDialog}>Cancel</Button>
          <Button
            onClick={handleCreateSubCircle}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

CircleVisualization.propTypes = {
  representativeId: PropTypes.string.isRequired,
};

export default CircleVisualization;
