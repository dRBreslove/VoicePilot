// ES6 version of the hotline service

/**
 * Service for handling the global hotline functionality
 */
class HotlineService {
  constructor() {
    this.hotlineNumber = '+1-800-VOICE-PILOT'; // Global hotline number
    this.activeCalls = new Map(); // Map of active calls: callId -> { userId, representativeId, startTime }
    this.callQueue = []; // Queue of waiting calls
  }

  /**
   * Get the global hotline number
   * @returns {string} - The formatted hotline number
   */
  getHotlineNumber() {
    return this.hotlineNumber;
  }

  /**
   * Format the hotline number for display
   * @returns {string} - The formatted hotline number
   */
  getFormattedHotlineNumber() {
    return this.formatPhoneNumber(this.hotlineNumber);
  }

  /**
   * Format a phone number for display
   * @param {string} phoneNumber - The phone number to format
   * @returns {string} - The formatted phone number
   */
  formatPhoneNumber(phoneNumber) {
    // Convert +1-800-VOICE-PILOT to a more readable format
    if (phoneNumber === '+1-800-VOICE-PILOT') {
      return '1-800-VOICE-PILOT';
    }

    // For regular phone numbers, format as (XXX) XXX-XXXX
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return phoneNumber;
  }

  /**
   * Simulate a new call to the hotline
   * @param {string} userId - The ID of the user making the call
   * @returns {string} - The call ID
   */
  initiateCall(userId) {
    const callId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Check if there's an available representative
    const availableRepresentative = this.findAvailableRepresentative();

    if (availableRepresentative) {
      // Connect the call immediately
      this.activeCalls.set(callId, {
        userId,
        representativeId: availableRepresentative.id,
        startTime: new Date(),
        status: 'connected',
      });

      // Update representative availability
      availableRepresentative.isAvailable = false;

      return {
        callId,
        status: 'connected',
        representative: availableRepresentative,
      };
    }
    // Add to queue
    this.callQueue.push({
      callId,
      userId,
      timestamp: new Date(),
    });

    return {
      callId,
      status: 'queued',
      position: this.callQueue.length,
    };
  }

  /**
   * Find an available representative
   * @returns {Object|null} - The available representative or null if none available
   */
  findAvailableRepresentative() {
    // In a real implementation, this would query the database
    // For now, we'll use the houseRepresentativeService
    const representatives = window.houseRepresentativeService.getRepresentatives();
    return representatives.find((rep) => rep.isAvailable) || null;
  }

  /**
   * End a call
   * @param {string} callId - The ID of the call to end
   * @returns {boolean} - Whether the call was ended successfully
   */
  endCall(callId) {
    const call = this.activeCalls.get(callId);

    if (!call) {
      return false;
    }

    // Update representative availability
    const representative = window.houseRepresentativeService.getRepresentatives()
      .find((rep) => rep.id === call.representativeId);

    if (representative) {
      representative.isAvailable = true;
    }

    // Remove the call
    this.activeCalls.delete(callId);

    // Process the next call in the queue
    this.processNextCall();

    return true;
  }

  /**
   * Process the next call in the queue
   */
  processNextCall() {
    if (this.callQueue.length === 0) {
      return;
    }

    const availableRepresentative = this.findAvailableRepresentative();

    if (!availableRepresentative) {
      return;
    }

    const nextCall = this.callQueue.shift();

    // Connect the call
    this.activeCalls.set(nextCall.callId, {
      userId: nextCall.userId,
      representativeId: availableRepresentative.id,
      startTime: new Date(),
      status: 'connected',
    });

    // Update representative availability
    availableRepresentative.isAvailable = false;

    // Notify the user that their call is now connected
    // In a real implementation, this would trigger a notification
    console.log(`Call ${nextCall.callId} is now connected to representative ${availableRepresentative.name}`);
  }

  /**
   * Get the status of a call
   * @param {string} callId - The ID of the call
   * @returns {Object|null} - The call status or null if not found
   */
  getCallStatus(callId) {
    // Check if the call is active
    const activeCall = this.activeCalls.get(callId);
    if (activeCall) {
      return {
        status: activeCall.status,
        representative: window.houseRepresentativeService.getRepresentatives()
          .find((rep) => rep.id === activeCall.representativeId),
        duration: Math.floor((new Date() - activeCall.startTime) / 1000),
      };
    }

    // Check if the call is in the queue
    const queuedCall = this.callQueue.find((call) => call.callId === callId);
    if (queuedCall) {
      const position = this.callQueue.indexOf(queuedCall) + 1;
      return {
        status: 'queued',
        position,
        estimatedWaitTime: position * 5, // Estimate 5 minutes per call
      };
    }

    return null;
  }

  /**
   * Get all active calls
   * @returns {Array} - Array of active calls
   */
  getActiveCalls() {
    return Array.from(this.activeCalls.entries()).map(([callId, call]) => ({
      callId,
      ...call,
      representative: window.houseRepresentativeService.getRepresentatives()
        .find((rep) => rep.id === call.representativeId),
      duration: Math.floor((new Date() - call.startTime) / 1000),
    }));
  }

  /**
   * Get the call queue
   * @returns {Array} - Array of queued calls
   */
  getCallQueue() {
    return this.callQueue.map((call, index) => ({
      ...call,
      position: index + 1,
      estimatedWaitTime: (index + 1) * 5, // Estimate 5 minutes per call
    }));
  }
}

// Export a singleton instance
export const hotlineService = new HotlineService();
