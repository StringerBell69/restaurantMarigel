'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

export function CustomersSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search) {
      router.push(`/admin/customers?search=${encodeURIComponent(search)}`);
    } else {
      router.push('/admin/customers');
    }
  };

  const clearSearch = () => {
    setSearch('');
    router.push('/admin/customers');
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <form onSubmit={handleSearchSubmit} className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
        {searchParams.get('search') && (
          <Button variant="ghost" onClick={clearSearch}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </form>
    </div>
  );
}
