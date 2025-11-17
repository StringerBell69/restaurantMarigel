import { getTodayStats, getUpcomingReservations } from '@/lib/db/queries';
import { Card } from '@/components/ui/card';
import { Calendar, Users, CheckCircle, Clock } from 'lucide-react';

export async function StatsCards() {
  const todayStats = await getTodayStats();
  const upcomingCount = await getUpcomingReservations(100);

  const stats = [
    {
      title: "Today's Reservations",
      value: todayStats?.total || 0,
      icon: Calendar,
      description: `${todayStats?.confirmed || 0} confirmed`,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: "Today's Guests",
      value: todayStats?.totalGuests || 0,
      icon: Users,
      description: `${todayStats?.checkedIn || 0} checked in`,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Completed Today',
      value: todayStats?.completed || 0,
      icon: CheckCircle,
      description: `${todayStats?.pending || 0} pending`,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      title: 'Upcoming Reservations',
      value: upcomingCount.length,
      icon: Clock,
      description: 'Next 7 days',
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
