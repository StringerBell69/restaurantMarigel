"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Check, Clock } from "lucide-react";
import { db } from "@/lib/db";
import { reservations } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    todayReservations: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
    totalGuests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];

        // Get all reservations for today
        const todayReservations = await db
          .select()
          .from(reservations)
          .where(eq(reservations.reservationDate, today));

        const pending = todayReservations.filter(r => r.status === 'pending').length;
        const confirmed = todayReservations.filter(r => r.status === 'confirmed').length;
        const totalGuests = todayReservations
          .filter(r => r.status !== 'cancelled')
          .reduce((sum, r) => sum + (r.guestsCount || 0), 0);

        setStats({
          todayReservations: todayReservations.length,
          pendingReservations: pending,
          confirmedReservations: confirmed,
          totalGuests,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Today's Reservations",
      value: loading ? "..." : stats.todayReservations,
      description: "Total bookings for today",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Pending",
      value: loading ? "..." : stats.pendingReservations,
      description: "Awaiting confirmation",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Confirmed",
      value: loading ? "..." : stats.confirmedReservations,
      description: "Ready for service",
      icon: Check,
      color: "text-green-600",
    },
    {
      title: "Total Guests",
      value: loading ? "..." : stats.totalGuests,
      description: "Expected today",
      icon: Users,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Restaurant Marigel Management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <a
              href="/admin/reservations?action=create"
              className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
            >
              <Calendar className="h-5 w-5 text-restaurant-burgundy" />
              <div>
                <div className="font-medium">New Reservation</div>
                <div className="text-sm text-muted-foreground">
                  Create a new booking
                </div>
              </div>
            </a>
            <a
              href="/admin/reservations"
              className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
            >
              <Users className="h-5 w-5 text-restaurant-burgundy" />
              <div>
                <div className="font-medium">View All Reservations</div>
                <div className="text-sm text-muted-foreground">
                  Manage bookings
                </div>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest reservations and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Activity feed coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
