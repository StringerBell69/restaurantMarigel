import { Card } from '@/components/ui/card';
import { db } from '@/lib/db';
import { reservations, customers } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { Calendar, UserPlus, XCircle, CheckCircle } from 'lucide-react';

export async function RecentActivity() {
  const recentReservations = await db
    .select({
      id: reservations.id,
      status: reservations.status,
      createdAt: reservations.createdAt,
      guestsCount: reservations.guestsCount,
      customerId: reservations.customerId,
    })
    .from(reservations)
    .orderBy(desc(reservations.createdAt))
    .limit(10);

  const activities = await Promise.all(
    recentReservations.map(async (reservation) => {
      const [customer] = await db
        .select()
        .from(customers)
        .where(eq(customers.id, reservation.customerId))
        .limit(1);

      let icon = Calendar;
      let color = 'text-blue-600 bg-blue-100';
      let action = 'created a reservation';

      if (reservation.status === 'confirmed') {
        icon = CheckCircle;
        color = 'text-green-600 bg-green-100';
        action = 'confirmed reservation';
      } else if (reservation.status === 'cancelled') {
        icon = XCircle;
        color = 'text-red-600 bg-red-100';
        action = 'cancelled reservation';
      }

      return {
        id: reservation.id,
        icon,
        color,
        action,
        customerName: `${customer?.firstName} ${customer?.lastName}`,
        timestamp: reservation.createdAt,
      };
    })
  );

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <p className="text-sm text-gray-600">Latest updates</p>
      </div>
      <div className="space-y-4 max-h-[300px] overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${activity.color} flex-shrink-0`}>
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.customerName}</span> {activity.action}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
