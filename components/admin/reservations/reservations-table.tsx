import { db } from '@/lib/db';
import { reservations, customers, restaurantTables } from '@/lib/db/schema';
import { eq, and, sql, inArray } from 'drizzle-orm';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ReservationActions } from './reservation-actions';

interface ReservationsTableProps {
  date?: string;
  status?: string;
  search?: string;
}

export async function ReservationsTable({
  date,
  status,
  search,
}: ReservationsTableProps) {
  const filterDate = date;

  let query = db
    .select({
      reservation: reservations,
      customer: customers,
    })
    .from(reservations)
    .leftJoin(customers, eq(reservations.customerId, customers.id))
    .$dynamic();

  // Apply filters
  const conditions = [];

  if (filterDate) {
    conditions.push(eq(reservations.reservationDate, filterDate));
  }

  if (status) {
    conditions.push(eq(reservations.status, status));
  }

  if (search) {
    conditions.push(
      sql`${customers.firstName} ILIKE ${`%${search}%`}
          OR ${customers.lastName} ILIKE ${`%${search}%`}
          OR ${customers.email} ILIKE ${`%${search}%`}
          OR ${customers.phone} ILIKE ${`%${search}%`}
          OR ${reservations.reservationNumber} ILIKE ${`%${search}%`}`
    );
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const results = await query.orderBy(reservations.reservationTime);

  // Récupérer toutes les tables assignées pour afficher leurs numéros
  const allTableIds = results
    .map(r => r.reservation.assignedTables || [])
    .flat()
    .filter((id): id is string => id !== null && id !== undefined);

  const uniqueTableIds = [...new Set(allTableIds)];

  const tablesData = uniqueTableIds.length > 0
    ? await db.select().from(restaurantTables).where(inArray(restaurantTables.id, uniqueTableIds))
    : [];

  const tablesMap = new Map(tablesData.map(t => [t.id, t.tableNumber]));

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      confirmed: 'default',
      checked_in: 'default',
      completed: 'outline',
      cancelled: 'destructive',
      no_show: 'destructive',
    };
    return variants[status] || 'outline';
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Réservation #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date & Heure</TableHead>
            <TableHead>Convives</TableHead>
            <TableHead>Table</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                Aucune réservation trouvée
              </TableCell>
            </TableRow>
          ) : (
            results.map(({ reservation, customer }) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-mono text-sm">
                  {reservation.reservationNumber}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {customer?.firstName} {customer?.lastName}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{new Date(reservation.reservationDate).toLocaleDateString()}</p>
                    <p className="text-gray-500">{reservation.reservationTime}</p>
                  </div>
                </TableCell>
                <TableCell>{reservation.guestsCount}</TableCell>
                <TableCell>
                  {reservation.assignedTables && reservation.assignedTables.length > 0
                    ? reservation.assignedTables.map(tableId => tablesMap.get(tableId)).filter(Boolean).join(', ')
                    : 'Non assignée'}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadge(reservation.status)}>
                    {reservation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="text-gray-900">{customer?.email}</p>
                    <p className="text-gray-500">{customer?.phone}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <ReservationActions reservation={reservation} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
