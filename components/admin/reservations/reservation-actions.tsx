'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, CheckCircle, XCircle, Eye, Edit, UserCheck } from 'lucide-react';

interface ReservationActionsProps {
  reservation: {
    id: string;
    status: string | null;
    reservationNumber: string;
  };
}

export function ReservationActions({ reservation }: ReservationActionsProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/reservations/${reservation.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/reservations/${reservation.id}/cancel`, {
        method: 'POST',
      });

      if (response.ok) {
        router.refresh();
        setShowCancelDialog(false);
      }
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkArrived = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/reservations/${reservation.id}/arrive`, {
        method: 'PATCH',
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to mark as arrived:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Quick arrival button for confirmed reservations */}
        {reservation.status === 'confirmed' && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleMarkArrived}
            disabled={isLoading}
            className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
          >
            <UserCheck className="h-4 w-4 mr-1" />
            Arrivé
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" disabled={isLoading}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push(`/admin/reservations/${reservation.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            Voir Détails
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/admin/reservations/${reservation.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {reservation.status === 'pending' && (
            <DropdownMenuItem onClick={() => handleStatusChange('confirmed')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirmer
            </DropdownMenuItem>
          )}
          {reservation.status === 'confirmed' && (
            <DropdownMenuItem onClick={() => handleStatusChange('checked_in')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Enregistrer
            </DropdownMenuItem>
          )}
          {reservation.status === 'checked_in' && (
            <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Terminer
            </DropdownMenuItem>
          )}
          {reservation.status !== 'cancelled' && reservation.status !== 'completed' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowCancelDialog(true)}
                className="text-red-600"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Annuler
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      </div>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la Réservation</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler la réservation #{reservation.reservationNumber}?
              Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Non, garder</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700"
            >
              Oui, annuler la réservation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
