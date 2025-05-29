import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const MOCK_DELIVERY_PARTNERS = [
  { id: 'dp1', name: 'Sohith Delivery 1' },
  { id: 'dp2', name: 'Sohith Delivery 2' },
  { id: 'dp3', name: 'Sohith Delivery 3' }
];

const VendorOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Record<string, string>>({});

  useEffect(() => {
    // Add a mock order if none exist
    const mockOrder = {
      _id: '123',
      customerName: 'Test Customer',
      status: 'pending',
      location: { lat: 12.9716, lng: 77.5946 }
    };
    setOrders([mockOrder]);

    axios.get(`${API_BASE_URL}/api/orders`)
      .then(res => {
        if (res.data.length > 0) {
          setOrders(res.data);
        }
      })
      .catch(err => console.error('Error fetching orders:', err));
  }, []);

  const assignPartner = async (orderId: string) => {
    try {
      const deliveryPartnerId = selectedPartner[orderId];
      await axios.post(`${API_BASE_URL}/api/orders/${orderId}/assign`, { deliveryPartnerId });
      setOrders(orders => orders.map(o => o._id === orderId ? { ...o, deliveryPartnerId, status: 'assigned' } : o));
    } catch (err) {
      console.error('Error assigning partner:', err);
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Vendor Orders (Sohith Generated)</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
        <thead>
          <tr>
            <th style={{ padding: 10, border: '1px solid #ddd' }}>Order ID</th>
            <th style={{ padding: 10, border: '1px solid #ddd' }}>Customer</th>
            <th style={{ padding: 10, border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: 10, border: '1px solid #ddd' }}>Assign Delivery Partner</th>
            <th style={{ padding: 10, border: '1px solid #ddd' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>{order._id}</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>{order.customerName}</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>{order.status}</td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>
                <select
                  value={selectedPartner[order._id] || ''}
                  onChange={e => setSelectedPartner(s => ({ ...s, [order._id]: e.target.value }))}
                  style={{ padding: 5, width: '100%' }}
                >
                  <option value=''>Select Partner</option>
                  {MOCK_DELIVERY_PARTNERS.map(dp => (
                    <option key={dp.id} value={dp.id}>{dp.name}</option>
                  ))}
                </select>
              </td>
              <td style={{ padding: 10, border: '1px solid #ddd' }}>
                <button
                  onClick={() => assignPartner(order._id)}
                  disabled={!selectedPartner[order._id] || order.status === 'assigned'}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: !selectedPartner[order._id] || order.status === 'assigned' ? '#ccc' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: selectedPartner[order._id] && order.status !== 'assigned' ? 'pointer' : 'not-allowed'
                  }}
                >
                  Assign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorOrders;