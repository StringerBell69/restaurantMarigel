import { db } from '@/lib/db';
import { customers, reservations } from '@/lib/db/schema';
import { sql, desc } from 'drizzle-orm';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Mail, Phone, Eye } from 'lucide-react';
import Link from 'next/link';

interface CustomersTableProps {
  search?: string;
}

export async function CustomersTable({ search }: CustomersTableProps) {
  let query;

  if (search) {
    query = db
      .select()
      .from(customers)
      .where(
        sql`${customers.firstName} ILIKE ${`%${search}%`}
            OR ${customers.lastName} ILIKE ${`%${search}%`}
            OR ${customers.email} ILIKE ${`%${search}%`}
            OR ${customers.phone} ILIKE ${`%${search}%`}`
      )
      .orderBy(desc(customers.createdAt))
      .limit(50);
  } else {
    query = db
      .select()
      .from(customers)
      .orderBy(desc(customers.createdAt))
      .limit(50);
  }

  const customersList = await query;

  // Get reservation counts for each customer
  const customersWithStats = await Promise.all(
    customersList.map(async (customer) => {
      const [stats] = await db
        .select({
          totalReservations: sql<number>`count(*)::int`,
          upcomingReservations: sql<number>`count(*) filter (where ${reservations.reservationDate} >= current_date and ${reservations.status} = 'confirmed')::int`,
        })
        .from(reservations)
        .where(sql`${reservations.customerId} = ${customer.id}`);

      return {
        ...customer,
        stats,
      };
    })
  );

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Total Reservations</TableHead>
            <TableHead>Upcoming</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Preferences</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customersWithStats.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                {search ? 'No customers found matching your search' : 'No customers yet'}
              </TableCell>
            </TableRow>
          ) : (
            customersWithStats.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-3 w-3" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-3 w-3" />
                      {customer.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {customer.stats?.totalReservations || 0}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge>
                    {customer.stats?.upcomingReservations || 0}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {customer.dietaryRestrictions && customer.dietaryRestrictions.length > 0 ? (
                    <Badge variant="secondary" className="text-xs">
                      {customer.dietaryRestrictions.length} restrictions
                    </Badge>
                  ) : (
                    <span className="text-sm text-gray-400">None</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/customers/${customer.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
