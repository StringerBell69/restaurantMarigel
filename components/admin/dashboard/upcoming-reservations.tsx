import { getUpcomingReservations } from '@/lib/db/queries';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';
import { db } from '@/lib/db';
import { customers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function UpcomingReservations() {
  const reservations = await getUpcomingReservations(5);

  // Fetch customer info for each reservation
  const reservationsWithCustomers = await Promise.all(
    reservations.map(async (reservation) => {
      const [customer] = reservation.customerId
        ? await db
            .select()
            .from(customers)
            .where(eq(customers.id, reservation.customerId))
            .limit(1)
        : [null];
      return { ...reservation, customer };
    })
  );

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Réservations à Venir</h3>
        <p className="text-sm text-gray-600">5 prochaines réservations</p>
      </div>
      <div className="space-y-4">
        {reservationsWithCustomers.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Aucune réservation à venir</p>
        ) : (
          reservationsWithCustomers.map((reservation) => (
            <div
              key={reservation.id}
              className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {reservation.customer?.firstName} {reservation.customer?.lastName}
                </p>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(reservation.reservationDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {reservation.reservationTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {reservation.guestsCount} convives
                  </span>
                </div>
              </div>
              <Badge
                variant={
                  reservation.status === 'confirmed'
                    ? 'default'
                    : reservation.status === 'pending'
                    ? 'secondary'
                    : 'outline'
                }
              >
                {reservation.status}
              </Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
