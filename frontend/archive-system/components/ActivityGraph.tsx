"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Sun', files: 2 },
  { day: 'Mon', files: 5 },
  { day: 'Tue', files: 3 },
  { day: 'Wed', files: 7 },
  { day: 'Thu', files: 6 },
  { day: 'Fri', files: 4 },
  { day: 'Sat', files: 5 },
];

export default function ActivityGraph() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm h-full">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Activity</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="files" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}