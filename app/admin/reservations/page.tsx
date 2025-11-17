"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Plus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Table {
  id: string;
  name: string;
  tableNumber: string;
  capacity: number;
  capacityMin: number;
  tableType: string | null;
  features: string[] | null;
  available: boolean;
}

interface Reservation {
  id: string;
  reservationNumber: string;
  reservationDate: string;
  reservationTime: string;
  guestsCount: number;
  status: string | null;
  assignedTables: string[] | null;
  customerName?: string;
}

export default function ReservationsPage() {
  const searchParams = useSearchParams();
  const [createDialogOpen, setCreateDialogOpen] = useState(searchParams.get('action') === 'create');
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [availableTables, setAvailableTables] = useState<Table[]>([]);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: "2",
    duration: "120",
    tableId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
    status: "confirmed",
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      // For now, we'll show a placeholder
      // In production, you'd fetch from your API
      setReservations([]);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleCheckAvailability = async () => {
    if (!formData.date || !formData.time || !formData.guests) {
      toast.error('Please fill in date, time, and number of guests');
      return;
    }

    setCheckingAvailability(true);

    try {
      const response = await fetch(
        `/api/tables/availability?date=${formData.date}&time=${formData.time}&guests=${formData.guests}&duration=${formData.duration}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error checking availability');
      }

      if (data.availableTables.length === 0) {
        toast.error('No tables available for your selection');
        setAvailableTables([]);
        return;
      }

      setAvailableTables(data.availableTables);
      toast.success(`${data.totalAvailable} table(s) available`);
    } catch (error: any) {
      toast.error(error.message || 'Error checking availability');
      setAvailableTables([]);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tableId) {
      toast.error('Please select a table');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/reservations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formData.date,
          time: formData.time,
          guests: parseInt(formData.guests),
          duration: parseInt(formData.duration),
          tableId: formData.tableId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          specialRequests: formData.specialRequests,
          status: formData.status,
          source: 'admin',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error creating reservation');
      }

      toast.success(`Reservation created: ${data.reservation.reservationNumber}`);
      setCreateDialogOpen(false);

      // Reset form
      setFormData({
        date: "",
        time: "",
        guests: "2",
        duration: "120",
        tableId: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        specialRequests: "",
        status: "confirmed",
      });
      setAvailableTables([]);

      // Refresh reservations list
      fetchReservations();
    } catch (error: any) {
      toast.error(error.message || 'Error creating reservation');
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Reservations</h1>
          <p className="text-muted-foreground">Manage restaurant bookings</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-restaurant-burgundy hover:bg-restaurant-burgundy/90">
              <Plus className="mr-2 h-4 w-4" />
              New Reservation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Reservation</DialogTitle>
              <DialogDescription>
                Add a new reservation to the system
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateReservation} className="space-y-4">
              {/* Date and Time Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.date}
                    onChange={(e) => {
                      setFormData({ ...formData, date: e.target.value });
                      setAvailableTables([]);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Select
                    value={formData.time}
                    onValueChange={(value) => {
                      setFormData({ ...formData, time: value });
                      setAvailableTables([]);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Guests and Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guests">Number of Guests *</Label>
                  <Select
                    value={formData.guests}
                    onValueChange={(value) => {
                      setFormData({ ...formData, guests: value });
                      setAvailableTables([]);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => setFormData({ ...formData, duration: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="180">3 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Check Availability Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleCheckAvailability}
                disabled={checkingAvailability || !formData.date || !formData.time || !formData.guests}
              >
                {checkingAvailability ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Check Availability
                  </>
                )}
              </Button>

              {/* Available Tables */}
              {availableTables.length > 0 && (
                <div className="space-y-2">
                  <Label>Select Table *</Label>
                  <Select
                    value={formData.tableId}
                    onValueChange={(value) => setFormData({ ...formData, tableId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a table" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTables.map((table) => (
                        <SelectItem key={table.id} value={table.id}>
                          Table {table.tableNumber} - Capacity: {table.capacity} ({table.tableType || 'Standard'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Customer Information */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="+33 6 12 34 56 78"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Input
                    id="specialRequests"
                    placeholder="Allergies, preferences, etc."
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="seated">Seated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
                  disabled={loading || !formData.tableId}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Reservation'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reservations List */}
      <Card>
        <CardHeader>
          <CardTitle>All Reservations</CardTitle>
          <CardDescription>View and manage all bookings</CardDescription>
        </CardHeader>
        <CardContent>
          {reservations.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No reservations yet</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Create your first reservation to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <div>
                    <div className="font-semibold">{reservation.reservationNumber}</div>
                    <div className="text-sm text-muted-foreground">
                      {reservation.customerName} • {reservation.guestsCount} guests
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{reservation.reservationDate}</div>
                    <div className="text-sm text-muted-foreground">{reservation.reservationTime}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
