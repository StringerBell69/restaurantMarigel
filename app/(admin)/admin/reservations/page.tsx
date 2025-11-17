import { ReservationsTable } from '@/components/admin/reservations/reservations-table';
import { ReservationsFilters } from '@/components/admin/reservations/reservations-filters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: { date?: string; status?: string; search?: string };
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Réservations</h1>
          <p className="text-gray-600 mt-1">Gérer toutes les réservations du restaurant</p>
        </div>
        <Link href="/admin/reservations/new">
          <Button className="bg-restaurant-burgundy hover:bg-restaurant-burgundy/90">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Réservation
          </Button>
        </Link>
      </div>

      <ReservationsFilters />

      <ReservationsTable
        date={searchParams.date}
        status={searchParams.status}
        search={searchParams.search}
      />
    </div>
  );
}
