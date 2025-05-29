/* WebSocket server real-time location logic */
import { Server as SocketIOServer, Socket } from 'socket.io';

interface TrackingSession {
  interval: NodeJS.Timeout;
  lat: number;
  lng: number;
}

const trackingSessions: Record<string, TrackingSession> = {};

export function configureSockets(io: SocketIOServer) {
  io.on('connection', (socket: Socket) => {
    socket.on('startTracking', ({ orderId, lat, lng }) => {
      if (trackingSessions[orderId]) {
        clearInterval(trackingSessions[orderId].interval);
      }
      let currentLat = lat;
      let currentLng = lng;
      const interval = setInterval(() => {
        currentLat += 0.0001;
        currentLng += 0.0001;
        io.emit(`location-${orderId}`, { lat: currentLat, lng: currentLng });
      }, 3000);
      trackingSessions[orderId] = { interval, lat: currentLat, lng: currentLng };
    });
    socket.on('disconnect', () => {
      // Optionally clear intervals on disconnect
    });
  });
}