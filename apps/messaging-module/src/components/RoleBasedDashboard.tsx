import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Dashboard } from './Dashboard';

export const RoleBasedDashboard = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('app_users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Failed to fetch role:', error.message);
      } else {
        setRole(data.role);
      }
    };

    fetchRole();
  }, []);

  if (!role) return <div className="text-white">Loading role...</div>;

  return (
    <div>
      <h2 className="text-xl text-white font-bold mb-2">Logged in as: {role}</h2>
      {role === 'admin' && <Dashboard />}
      {role === 'manager' && <Dashboard />}
      {role === 'staff' && <Dashboard />}
      {role === 'dev' && <Dashboard />}
    </div>
  );
};
