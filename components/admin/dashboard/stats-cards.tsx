import { getTodayStats, getUpcomingReservations } from '@/lib/db/queries';
import { Card } from '@/components/ui/card';
import { Calendar, Users, CheckCircle, Clock } from 'lucide-react';

export async function StatsCards() {
  const todayStats = await getTodayStats();
  const upcomingCount = await getUpcomingReservations(100);

  const stats = [
    {
      title: "Réservations Aujourd'hui",
      value: todayStats?.total || 0,
      icon: Calendar,
      description: `${todayStats?.confirmed || 0} confirmées`,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: "Convives Aujourd'hui",
      value: todayStats?.totalGuests || 0,
      icon: Users,
      description: `${todayStats?.checkedIn || 0} arrivés`,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Terminées Aujourd\'hui',
      value: todayStats?.completed || 0,
      icon: CheckCircle,
      description: `${todayStats?.pending || 0} en attente`,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      title: 'Réservations à Venir',
      value: upcomingCount.length,
      icon: Clock,
      description: '7 prochains jours',
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
