import { TablesGrid } from '@/components/admin/tables/tables-grid';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function TablesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Tables</h1>
          <p className="text-gray-600 mt-1">Gérer les tables du restaurant et les arrangements de sièges</p>
        </div>
        <Link href="/admin/tables/new">
          <Button className="bg-restaurant-burgundy hover:bg-restaurant-burgundy/90">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une Table
          </Button>
        </Link>
      </div>

      <TablesGrid />
    </div>
  );
}
