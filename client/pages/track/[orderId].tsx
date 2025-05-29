/* Customer real-time tracking page */

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { io, Socket } from 'socket.io-client';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

const DEFAULT_POSITION = { lat: 12.9716, lng: 77.5946 };

const TrackOrder: React.FC = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!orderId) return;
    socketRef.current = io('http://localhost:5050');
    socketRef.current.on(`location-${orderId}`, (data: { lat: number; lng: number }) => {
      setPosition({ lat: data.lat, lng: data.lng });
    });
    return () => {
      socketRef.current?.disconnect();
    };
  }, [orderId]);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <h1 style={{ textAlign: 'center' }}>Track Order (Sohith Generated)</h1>
      <div style={{ height: '80vh', width: '100%' }}>
        <Map center={[position.lat, position.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[position.lat, position.lng]} />
        </Map>
      </div>
    </div>
  );
};

export default TrackOrder;