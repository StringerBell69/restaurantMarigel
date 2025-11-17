import { CustomersTable } from '@/components/admin/customers/customers-table';
import { CustomersSearch } from '@/components/admin/customers/customers-search';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">Gérer les informations et l'historique des clients</p>
        </div>
        <Link href="/admin/customers/new">
          <Button className="bg-restaurant-burgundy hover:bg-restaurant-burgundy/90">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un Client
          </Button>
        </Link>
      </div>

      <CustomersSearch />

      <CustomersTable search={searchParams.search} />
    </div>
  );
}
