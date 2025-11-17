'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

export function ReservationsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/admin/reservations?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange('search', search);
  };

  const clearFilters = () => {
    setSearch('');
    router.push('/admin/reservations');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by customer name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Date
          </label>
          <Input
            type="date"
            defaultValue={searchParams.get('date') || today}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Status
          </label>
          <Select
            defaultValue={searchParams.get('status') || 'all'}
            onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="checked_in">Checked In</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="ghost" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>
    </div>
  );
}
