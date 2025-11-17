'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface AvailableTable {
  id: string;
  name: string;
  tableNumber: string;
  capacity: number;
  capacityMin: number;
  location?: string;
  features?: string[];
  available: boolean;
}

export default function NewReservationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availableTables, setAvailableTables] = useState<AvailableTable[]>([]);

  const [formData, setFormData] = useState({
    // Customer info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Reservation details
    reservationDate: '',
    reservationTime: '',
    guestsCount: 2,
    duration: 120,
    tableId: '',
    // Optional
    specialRequests: '',
    occasion: '',
  });

  // Check availability when date, time, guests, or duration changes
  useEffect(() => {
    const checkAvailability = async () => {
      if (!formData.reservationDate || !formData.reservationTime || !formData.guestsCount) {
        setAvailableTables([]);
        return;
      }

      setCheckingAvailability(true);
      try {
        const response = await fetch(
          `/api/tables/availability?date=${formData.reservationDate}&time=${formData.reservationTime}&guests=${formData.guestsCount}&duration=${formData.duration}`
        );
        const data = await response.json();

        if (response.ok) {
          setAvailableTables(data.availableTables || []);
        } else {
          setAvailableTables([]);
        }
      } catch (error) {
        console.error('Error checking availability:', error);
        setAvailableTables([]);
      } finally {
        setCheckingAvailability(false);
      }
    };

    checkAvailability();
  }, [formData.reservationDate, formData.reservationTime, formData.guestsCount, formData.duration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tableId) {
      toast.error('Veuillez sélectionner une table');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/reservations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Échec de la création de la réservation');
      }

      const result = await response.json();
      toast.success('Réservation créée avec succès !');
      router.push(`/admin/reservations?date=${formData.reservationDate}`);
    } catch (error: any) {
      toast.error(error.message || 'Échec de la création de la réservation');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/reservations">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nouvelle Réservation</h1>
          <p className="text-gray-600 mt-1">Créer une nouvelle réservation manuellement</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          {/* Customer Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Informations Client</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Détails de la Réservation</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="reservationDate">Date *</Label>
                <Input
                  id="reservationDate"
                  type="date"
                  min={today}
                  value={formData.reservationDate}
                  onChange={(e) => handleChange('reservationDate', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reservationTime">Heure *</Label>
                <Input
                  id="reservationTime"
                  type="time"
                  value={formData.reservationTime}
                  onChange={(e) => handleChange('reservationTime', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guestsCount">Nombre de Convives *</Label>
                <Select
                  value={formData.guestsCount.toString()}
                  onValueChange={(value) => handleChange('guestsCount', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Convive' : 'Convives'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="60"
                  max="300"
                  step="15"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="tableId">Assignation de Table *</Label>
                {checkingAvailability ? (
                  <div className="flex items-center gap-2 p-2 border rounded-md">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-500">Vérification de la disponibilité...</span>
                  </div>
                ) : availableTables.length === 0 && formData.reservationDate && formData.reservationTime ? (
                  <div className="p-2 border rounded-md text-sm text-gray-500">
                    Aucune table disponible pour la date/heure sélectionnée
                  </div>
                ) : (
                  <Select
                    value={formData.tableId}
                    onValueChange={(value) => handleChange('tableId', value)}
                    disabled={availableTables.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une table" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTables.map((table) => (
                        <SelectItem key={table.id} value={table.id}>
                          Table {table.tableNumber} (Capacité: {table.capacityMin}-{table.capacity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>

          {/* Optional Information */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Informations Supplémentaires</h2>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="occasion">Occasion</Label>
                <Select
                  value={formData.occasion}
                  onValueChange={(value) => handleChange('occasion', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une occasion (optionnel)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    <SelectItem value="birthday">Anniversaire</SelectItem>
                    <SelectItem value="anniversary">Anniversaire de Mariage</SelectItem>
                    <SelectItem value="business">Dîner d&apos;Affaires</SelectItem>
                    <SelectItem value="date">Soirée Romantique</SelectItem>
                    <SelectItem value="celebration">Célébration</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="specialRequests">Demandes Spéciales</Label>
                <textarea
                  id="specialRequests"
                  className="flex min-h-[100px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Restrictions alimentaires, préférences de sièges, etc."
                  value={formData.specialRequests}
                  onChange={(e) => handleChange('specialRequests', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
            >
              {loading ? 'Création...' : 'Créer la Réservation'}
            </Button>
            <Link href="/admin/reservations">
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </Link>
          </div>
        </Card>
      </form>
    </div>
  );
}
