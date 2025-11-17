'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save } from 'lucide-react';

interface SettingsFormProps {
  initialSettings: {
    businessHours: any;
    reservationSettings: any;
    notificationSettings: any;
  };
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [businessHours, setBusinessHours] = useState(
    initialSettings.businessHours || {
      monday: { open: '11:00', close: '22:00', closed: false },
      tuesday: { open: '11:00', close: '22:00', closed: false },
      wednesday: { open: '11:00', close: '22:00', closed: false },
      thursday: { open: '11:00', close: '22:00', closed: false },
      friday: { open: '11:00', close: '23:00', closed: false },
      saturday: { open: '11:00', close: '23:00', closed: false },
      sunday: { open: '12:00', close: '21:00', closed: false },
    }
  );

  const [reservationSettings, setReservationSettings] = useState(
    initialSettings.reservationSettings || {
      maxAdvanceBookingDays: 60,
      minAdvanceBookingHours: 2,
      maxGuestsPerReservation: 12,
      defaultReservationDuration: 120,
      allowWaitlist: true,
      requireDeposit: false,
      depositAmount: 0,
    }
  );

  const [notificationSettings, setNotificationSettings] = useState(
    initialSettings.notificationSettings || {
      emailNotifications: true,
      smsNotifications: false,
      whatsappNotifications: false,
      sendConfirmation: true,
      sendReminder: true,
      reminderHoursBefore: 24,
    }
  );

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessHours,
          reservationSettings,
          notificationSettings,
        }),
      });

      if (response.ok) {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="hours" className="w-full">
        <TabsList>
          <TabsTrigger value="hours">Business Hours</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="hours">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
            <div className="space-y-4">
              {days.map((day) => (
                <div key={day} className="grid grid-cols-4 gap-4 items-center">
                  <Label className="capitalize">{day}</Label>
                  <Input
                    type="time"
                    value={businessHours[day].open}
                    onChange={(e) =>
                      setBusinessHours({
                        ...businessHours,
                        [day]: { ...businessHours[day], open: e.target.value },
                      })
                    }
                    disabled={businessHours[day].closed}
                  />
                  <Input
                    type="time"
                    value={businessHours[day].close}
                    onChange={(e) =>
                      setBusinessHours({
                        ...businessHours,
                        [day]: { ...businessHours[day], close: e.target.value },
                      })
                    }
                    disabled={businessHours[day].closed}
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={businessHours[day].closed}
                      onCheckedChange={(checked) =>
                        setBusinessHours({
                          ...businessHours,
                          [day]: { ...businessHours[day], closed: checked },
                        })
                      }
                    />
                    <Label className="text-sm">Closed</Label>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reservations">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Reservation Settings</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Max Advance Booking (days)</Label>
                  <Input
                    type="number"
                    value={reservationSettings.maxAdvanceBookingDays}
                    onChange={(e) =>
                      setReservationSettings({
                        ...reservationSettings,
                        maxAdvanceBookingDays: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Min Advance Booking (hours)</Label>
                  <Input
                    type="number"
                    value={reservationSettings.minAdvanceBookingHours}
                    onChange={(e) =>
                      setReservationSettings({
                        ...reservationSettings,
                        minAdvanceBookingHours: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Max Guests Per Reservation</Label>
                  <Input
                    type="number"
                    value={reservationSettings.maxGuestsPerReservation}
                    onChange={(e) =>
                      setReservationSettings({
                        ...reservationSettings,
                        maxGuestsPerReservation: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Default Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={reservationSettings.defaultReservationDuration}
                    onChange={(e) =>
                      setReservationSettings({
                        ...reservationSettings,
                        defaultReservationDuration: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label>Allow Waitlist</Label>
                  <Switch
                    checked={reservationSettings.allowWaitlist}
                    onCheckedChange={(checked) =>
                      setReservationSettings({
                        ...reservationSettings,
                        allowWaitlist: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require Deposit</Label>
                  <Switch
                    checked={reservationSettings.requireDeposit}
                    onCheckedChange={(checked) =>
                      setReservationSettings({
                        ...reservationSettings,
                        requireDeposit: checked,
                      })
                    }
                  />
                </div>
                {reservationSettings.requireDeposit && (
                  <div>
                    <Label>Deposit Amount ($)</Label>
                    <Input
                      type="number"
                      value={reservationSettings.depositAmount}
                      onChange={(e) =>
                        setReservationSettings({
                          ...reservationSettings,
                          depositAmount: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Send notifications via email</p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-gray-500">Send notifications via SMS</p>
                </div>
                <Switch
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      smsNotifications: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>WhatsApp Notifications</Label>
                  <p className="text-sm text-gray-500">Send notifications via WhatsApp</p>
                </div>
                <Switch
                  checked={notificationSettings.whatsappNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      whatsappNotifications: checked,
                    })
                  }
                />
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Send Confirmation Messages</Label>
                  <Switch
                    checked={notificationSettings.sendConfirmation}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        sendConfirmation: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Send Reminder Messages</Label>
                  <Switch
                    checked={notificationSettings.sendReminder}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        sendReminder: checked,
                      })
                    }
                  />
                </div>
                {notificationSettings.sendReminder && (
                  <div>
                    <Label>Send Reminder (hours before)</Label>
                    <Input
                      type="number"
                      value={notificationSettings.reminderHoursBefore}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          reminderHoursBefore: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-4">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
        {saved && (
          <span className="text-green-600 text-sm">Settings saved successfully!</span>
        )}
      </div>
    </div>
  );
}
