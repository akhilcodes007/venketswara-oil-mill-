let ioInstance = null;

/**
 * initSocket — Registers the Socket.io server instance and sets up
 * connection/disconnection logging and room-join support.
 *
 * Call this once from server.js after creating the Socket.io server.
 *
 * @param {import('socket.io').Server} io - The Socket.io Server instance
 */
export function initSocket(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    /**
     * 'join' event — Client sends their userId or 'admin' to subscribe
     * to a private room. Emitted events go to the room, not broadcast.
     *
     * Frontend usage:
     *   socket.emit('join', user.id);       // for customer
     *   socket.emit('join', 'admin');        // for admin dashboard
     */
    socket.on('join', (roomId) => {
      socket.join(roomId);
      console.log(`[Socket.io] ${socket.id} joined room: ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
}

/**
 * emitNotification — Sends a real-time event to a specific room.
 *
 * @param {string} room  - Room name (userId or 'admin')
 * @param {string} event - Event name (e.g. 'order:status', 'admin:newOrder')
 * @param {object} data  - Event payload
 */
export function emitNotification(room, event, data) {
  if (!ioInstance) {
    console.warn('[Socket.io] No IO instance initialised — cannot emit event');
    return;
  }
  ioInstance.to(room).emit(event, {
    ...data,
    timestamp: new Date().toISOString(),
  });
}

/**
 * getIO — Returns the stored Socket.io instance.
 * Useful for controllers that need direct access to io.
 *
 * @returns {import('socket.io').Server | null}
 */
export function getIO() {
  return ioInstance;
}
