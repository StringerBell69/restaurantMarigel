'use client';

import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

interface ChartData {
  date: string;
  reservations: number;
}

export function ReservationsChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/admin/stats/weekly');
        const result = await response.json();
        setData(result.data || []);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Reservations This Week</h3>
        <p className="text-sm text-gray-600">Daily reservation count</p>
      </div>
      {loading ? (
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-gray-500">Loading chart...</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="reservations" fill="#8B0000" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
