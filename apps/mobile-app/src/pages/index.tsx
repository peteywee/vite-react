import React from 'react';
import { Calendar } from '../components/Calendar';
import { ClockInOut } from '../components/ClockInOut';
import { Messaging } from '../components/Messaging';
import { Auth } from '../components/Auth';

export default function HomePage() {
  return (
    <div className="space-y-4 p-4 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold">🏢 StaffFlow Dashboard</h1>
      <Auth />
      <Calendar />
      <ClockInOut />
      <Messaging />
    </div>
  );
}
