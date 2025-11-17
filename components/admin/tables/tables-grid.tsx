import { getActiveTables } from '@/lib/db/queries';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Edit } from 'lucide-react';
import Link from 'next/link';

export async function TablesGrid() {
  const tables = await getActiveTables();

  const getTableTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      standard: 'bg-blue-100 text-blue-800',
      booth: 'bg-purple-100 text-purple-800',
      bar: 'bg-orange-100 text-orange-800',
      outdoor: 'bg-green-100 text-green-800',
      private: 'bg-red-100 text-red-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tables.length === 0 ? (
        <div className="col-span-full">
          <Card className="p-12">
            <p className="text-center text-gray-500">
              Aucune table trouvée. Ajoutez votre première table pour commencer.
            </p>
          </Card>
        </div>
      ) : (
        tables.map((table) => (
          <Card key={table.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Table {table.tableNumber}
                </h3>
                <Badge className={`mt-2 ${getTableTypeColor(table.tableType || 'Standard')}`}>
                  {table.tableType || 'Standard'}
                </Badge>
              </div>
              <Link href={`/admin/tables/${table.id}/edit`}>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">
                  Capacité: {table.capacityMin}-{table.capacityMax} convives
                </span>
              </div>

              {table.floorLevel && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">Étage {table.floorLevel}</span>
                </div>
              )}

              {table.features && table.features.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {table.features.map((feature) => (
                    <Badge
                      key={feature}
                      variant="outline"
                      className="text-xs"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Statut</span>
                  <Badge variant={table.isActive ? 'default' : 'secondary'}>
                    {table.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
