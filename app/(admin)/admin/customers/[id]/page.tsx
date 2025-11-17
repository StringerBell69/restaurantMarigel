import { db } from '@/lib/db';
import { customers, reservations } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface CustomerDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function CustomerDetailsPage({ params }: CustomerDetailsPageProps) {
  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.id, params.id))
    .limit(1);

  if (!customer) {
    notFound();
  }

  // Get customer's reservations
  const customerReservations = await db
    .select()
    .from(reservations)
    .where(eq(reservations.customerId, params.id))
    .orderBy(desc(reservations.reservationDate));

  const upcomingReservations = customerReservations.filter(
    (r) => new Date(r.reservationDate) >= new Date() && r.status !== 'cancelled'
  );

  const pastReservations = customerReservations.filter(
    (r) => new Date(r.reservationDate) < new Date() || r.status === 'cancelled'
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/customers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-gray-600 mt-1">Customer Details</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Phone className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">
                  {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-gray-900">
                {customerReservations.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Total Reservations</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-restaurant-burgundy">
                {upcomingReservations.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Upcoming</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {customerReservations.filter((r) => r.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Completed</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">
                {customerReservations.filter((r) => r.status === 'cancelled').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Cancelled</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Dietary Restrictions */}
      {customer.dietaryRestrictions && customer.dietaryRestrictions.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Dietary Restrictions</h2>
          <div className="flex flex-wrap gap-2">
            {customer.dietaryRestrictions.map((restriction) => (
              <Badge key={restriction} variant="secondary">
                {restriction}
              </Badge>
            ))}
          </div>
          {customer.allergens && customer.allergens.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">Allergens:</p>
              <p className="text-sm text-yellow-700 mt-1">{customer.allergens.join(', ')}</p>
            </div>
          )}
        </Card>
      )}

      {/* Notes */}
      {customer.notes && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Internal Notes</h2>
          <p className="text-gray-700">{customer.notes}</p>
        </Card>
      )}

      {/* Upcoming Reservations */}
      {upcomingReservations.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Reservations</h2>
          <div className="space-y-3">
            {upcomingReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {new Date(reservation.reservationDate).toLocaleDateString()} at{' '}
                    {reservation.reservationTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    {reservation.guestsCount} guests · {reservation.reservationNumber}
                  </p>
                </div>
                <Badge>{reservation.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Past Reservations */}
      {pastReservations.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Past Reservations</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {pastReservations.slice(0, 10).map((reservation) => (
              <div
                key={reservation.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {new Date(reservation.reservationDate).toLocaleDateString()} at{' '}
                    {reservation.reservationTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    {reservation.guestsCount} guests · {reservation.reservationNumber}
                  </p>
                </div>
                <Badge variant="outline">{reservation.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
