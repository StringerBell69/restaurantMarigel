import { SettingsForm } from '@/components/admin/settings/settings-form';
import { getRestaurantSetting } from '@/lib/db/queries';

export default async function SettingsPage() {
  // Load current settings
  const businessHours = await getRestaurantSetting('business_hours');
  const reservationSettings = await getRestaurantSetting('reservation_settings');
  const notificationSettings = await getRestaurantSetting('notification_settings');

  const settings = {
    businessHours: businessHours ? JSON.parse(businessHours) : null,
    reservationSettings: reservationSettings ? JSON.parse(reservationSettings) : null,
    notificationSettings: notificationSettings ? JSON.parse(notificationSettings) : null,
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your restaurant settings</p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
