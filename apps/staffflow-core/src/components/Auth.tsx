import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else alert('Logged in!');
  };

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Check your email to confirm.');
  };

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h2 className="text-lg mb-2">Login or Register</h2>
      <input className="text-black p-1 mb-2 w-full" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="text-black p-1 mb-2 w-full" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button className="bg-blue-600 px-4 py-2 mr-2 rounded" onClick={signIn}>Sign In</button>
      <button className="bg-green-600 px-4 py-2 rounded" onClick={signUp}>Sign Up</button>
    </div>
  );
};
