import { TablesGrid } from '@/components/admin/tables/tables-grid';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function TablesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tables Management</h1>
          <p className="text-gray-600 mt-1">Manage restaurant tables and seating arrangements</p>
        </div>
        <Link href="/admin/tables/new">
          <Button className="bg-restaurant-burgundy hover:bg-restaurant-burgundy/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Table
          </Button>
        </Link>
      </div>

      <TablesGrid />
    </div>
  );
}
