let io;

/**
 * Initializes the Socket.io logic on connection.
 * @param {Object} socketIoInstance - Socket.io Server instance.
 */
export function initSocket(socketIoInstance) {
  io = socketIoInstance;
  
  io.on("connection", (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Allow clients to join rooms based on role or userId
    socket.on("join", (room) => {
      socket.join(room);
      console.log(`[Socket.io] Client ${socket.id} joined room: ${room}`);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
}

/**
 * Broadcasts an event to a specific room.
 * @param {String} room - Room ID (e.g. 'admin' or userId).
 * @param {String} event - Event name (e.g. 'new_order', 'order_update').
 * @param {Object} data - Payload.
 */
export function emitNotification(room, event, data) {
  if (io) {
    io.to(room).emit(event, data);
    console.log(`[Socket.io] Emitted event '${event}' to room '${room}'`);
  } else {
    console.log(`[Socket.io Simulator] Event '${event}' to room '${room}' with data:`, data);
  }
}
