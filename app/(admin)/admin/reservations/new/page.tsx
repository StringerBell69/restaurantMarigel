'use client';

import { useState } from 'react';
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
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewReservationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    // Optional
    specialRequests: '',
    occasion: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/reservations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create reservation');
      }

      const result = await response.json();
      toast.success('Reservation created successfully!');
      router.push(`/admin/reservations?date=${formData.reservationDate}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create reservation');
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
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Reservation</h1>
          <p className="text-gray-600 mt-1">Create a new reservation manually</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          {/* Customer Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
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
                <Label htmlFor="phone">Phone *</Label>
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
            <h2 className="text-lg font-semibold mb-4">Reservation Details</h2>
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
                <Label htmlFor="reservationTime">Time *</Label>
                <Input
                  id="reservationTime"
                  type="time"
                  value={formData.reservationTime}
                  onChange={(e) => handleChange('reservationTime', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guestsCount">Number of Guests *</Label>
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
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
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
            </div>
          </div>

          {/* Optional Information */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="occasion">Occasion</Label>
                <Select
                  value={formData.occasion}
                  onValueChange={(value) => handleChange('occasion', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an occasion (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="birthday">Birthday</SelectItem>
                    <SelectItem value="anniversary">Anniversary</SelectItem>
                    <SelectItem value="business">Business Dinner</SelectItem>
                    <SelectItem value="date">Date Night</SelectItem>
                    <SelectItem value="celebration">Celebration</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="specialRequests">Special Requests</Label>
                <textarea
                  id="specialRequests"
                  className="flex min-h-[100px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Any dietary restrictions, seating preferences, etc."
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
              {loading ? 'Creating...' : 'Create Reservation'}
            </Button>
            <Link href="/admin/reservations">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </Card>
      </form>
    </div>
  );
}
