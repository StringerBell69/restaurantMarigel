import { StatsCards } from '@/components/admin/dashboard/stats-cards';
import { ReservationsChart } from '@/components/admin/dashboard/reservations-chart';
import { UpcomingReservations } from '@/components/admin/dashboard/upcoming-reservations';
import { RecentActivity } from '@/components/admin/dashboard/recent-activity';

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here&apos;s your restaurant overview.</p>
      </div>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <ReservationsChart />
        <RecentActivity />
      </div>

      <UpcomingReservations />
    </div>
  );
}
