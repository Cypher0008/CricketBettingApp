import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [creditRequests, setCreditRequests] = useState([]);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token available');

      const headers = { Authorization: `Bearer ${token}` };

      const [userRes, creditRes, betRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users`, { headers }),
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/credit-requests`, { headers }),
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/bets`, { headers }),
      ]);

      setUsers(userRes.data);
      setCreditRequests(creditRes.data);
      setBets(betRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData(); // ✅ Trigger only if admin
    }
  }, [isAdmin]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>🏆 Admin Dashboard</h2>
      {/* ✅ Render User, Credit Requests, and Bets */}
      {/* ✅ Use map function to render dynamically */}
    </div>
  );
};

export default AdminDashboard;
