import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  TextField,
  Divider,
  Alert,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SendIcon from '@mui/icons-material/Send';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { voiceService } from '../services/voiceService';

/**
 * VoiceRecorder component for recording voice conversations and sending to WhatsApp
 * @param {Object} props - Component props
 * @param {string} props.representativeId - ID of the representative
 * @param {string} props.representativeName - Name of the representative
 * @param {string} [props.userPhone] - Phone number of the user (optional)
 */
function VoiceRecorder({ representativeId, representativeName, userPhone }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState(userPhone || '');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState('');
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const processAudio = async (audioBlob) => {
    setIsProcessing(true);
    try {
      // Convert voice to text
      const transcribedText = await voiceService.convertVoiceToText(audioBlob);
      setTranscription(transcribedText);

      // Generate summary
      const conversationSummary = await voiceService.summarizeConversation(transcribedText);
      setSummary(conversationSummary);

      // Pre-fill WhatsApp message with summary
      setWhatsappMessage(conversationSummary);
    } catch (err) {
      setError('Error processing audio. Please try again.');
      console.error('Error processing audio:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);

        // Stop all tracks to release the microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Error accessing microphone. Please ensure you have granted microphone permissions.');
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendToWhatsApp = async () => {
    if (!whatsappNumber) {
      setError('Please enter a WhatsApp number');
      return;
    }

    if (!whatsappMessage) {
      setError('Please enter a message to send');
      return;
    }

    setIsSending(true);
    try {
      const success = await voiceService.sendToWhatsApp(whatsappNumber, whatsappMessage);
      if (!success) {
        setError('Failed to send message to WhatsApp');
      }
    } catch (err) {
      setError('Error sending message to WhatsApp');
      console.error('Error sending to WhatsApp:', err);
    } finally {
      setIsSending(false);
    }
  };

  const receiveFromWhatsApp = async () => {
    if (!whatsappNumber) {
      setError('Please enter a WhatsApp number');
      return;
    }

    setIsReceiving(true);
    try {
      const audioBlob = await voiceService.receiveWhatsAppVoiceMessage(whatsappNumber);
      await processAudio(audioBlob);
    } catch (err) {
      setError('Error receiving message from WhatsApp');
      console.error('Error receiving from WhatsApp:', err);
    } finally {
      setIsReceiving(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Voice Conversation with {representativeName}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Button
          variant="contained"
          color={isRecording ? 'error' : 'primary'}
          startIcon={isRecording ? <StopIcon /> : <MicIcon />}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing || isSending || isReceiving}
          sx={{ mr: 2 }}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<WhatsAppIcon />}
          onClick={receiveFromWhatsApp}
          disabled={isRecording || isProcessing || isSending || isReceiving}
        >
          Receive from WhatsApp
        </Button>
      </Box>

      {isProcessing && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ ml: 2, alignSelf: 'center' }}>
            Processing audio...
          </Typography>
        </Box>
      )}

      {transcription && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Transcription:
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, maxHeight: '150px', overflow: 'auto' }}>
            <Typography variant="body2">
              {transcription}
            </Typography>
          </Paper>
        </Box>
      )}

      {summary && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Summary:
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, maxHeight: '150px', overflow: 'auto' }}>
            <Typography variant="body2">
              {summary}
            </Typography>
          </Paper>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" gutterBottom>
        Send to WhatsApp:
      </Typography>

      <TextField
        fullWidth
        label="WhatsApp Number"
        variant="outlined"
        value={whatsappNumber}
        onChange={(e) => setWhatsappNumber(e.target.value)}
        margin="normal"
        placeholder="+1234567890"
        disabled={isRecording || isProcessing || isSending || isReceiving}
      />

      <TextField
        fullWidth
        label="Message"
        variant="outlined"
        value={whatsappMessage}
        onChange={(e) => setWhatsappMessage(e.target.value)}
        margin="normal"
        multiline
        rows={4}
        disabled={isRecording || isProcessing || isSending || isReceiving}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={sendToWhatsApp}
          disabled={isRecording || isProcessing || isSending || isReceiving || !whatsappNumber || !whatsappMessage}
        >
          {isSending ? 'Sending...' : 'Send to WhatsApp'}
        </Button>
      </Box>
    </Paper>
  );
}

export default VoiceRecorder;
