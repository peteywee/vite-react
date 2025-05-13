import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [venues, setVenues] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    const fetchData = async () => {
      const { data: s } = await supabase.from('shifts').select('*').limit(5);
      const { data: v } = await supabase.from('venues').select('*').limit(5);
      const { data: m } = await supabase.from('messages').select('*').limit(5);

      setShifts(s || []);
      setVenues(v || []);
      setMessages(m || []);
    };

    fetchUser();
    fetchData();
  }, []);

  return (
    <div className="p-4 bg-gray-900 text-white rounded">
      <h2 className="text-xl font-bold mb-2">📊 Dashboard</h2>
      <div><strong>User:</strong> {user?.email || 'Not logged in'}</div>

      <h3 className="mt-4 font-semibold">🕒 Shifts</h3>
      <ul>{shifts.map(s => <li key={s.id}>{s.status} @ {s.start_time}</li>)}</ul>

      <h3 className="mt-4 font-semibold">🏢 Venues</h3>
      <ul>{venues.map(v => <li key={v.id}>{v.name}</li>)}</ul>

      <h3 className="mt-4 font-semibold">💬 Messages</h3>
      <ul>{messages.map(m => <li key={m.id}>{m.message}</li>)}</ul>
    </div>
  );
};
