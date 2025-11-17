'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewCustomerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredLanguage: 'en',
    dietaryRestrictions: [] as string[],
    allergies: '',
    notes: '',
  });

  const [restrictionInput, setRestrictionInput] = useState('');

  const commonRestrictions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut Allergy',
    'Shellfish Allergy',
    'Halal',
    'Kosher',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/customers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create customer');
      }

      const result = await response.json();
      toast.success('Customer created successfully!');
      router.push(`/admin/customers/${result.data.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addRestriction = (restriction: string) => {
    if (restriction && !formData.dietaryRestrictions.includes(restriction)) {
      setFormData((prev) => ({
        ...prev,
        dietaryRestrictions: [...prev.dietaryRestrictions, restriction],
      }));
      setRestrictionInput('');
    }
  };

  const removeRestriction = (restriction: string) => {
    setFormData((prev) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.filter((r) => r !== restriction),
    }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/customers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Customer</h1>
          <p className="text-gray-600 mt-1">Create a new customer profile</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
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
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
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
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="preferredLanguage">Preferred Language</Label>
                <select
                  id="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={(e) => handleChange('preferredLanguage', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Dietary Preferences & Restrictions</h2>
            <div className="space-y-4">
              <div>
                <Label>Common Restrictions</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {commonRestrictions.map((restriction) => (
                    <Button
                      key={restriction}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addRestriction(restriction)}
                      disabled={formData.dietaryRestrictions.includes(restriction)}
                    >
                      {restriction}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="customRestriction">Add Custom Restriction</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="customRestriction"
                    value={restrictionInput}
                    onChange={(e) => setRestrictionInput(e.target.value)}
                    placeholder="Enter custom dietary restriction"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addRestriction(restrictionInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addRestriction(restrictionInput)}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {formData.dietaryRestrictions.length > 0 && (
                <div>
                  <Label>Selected Restrictions</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.dietaryRestrictions.map((restriction) => (
                      <Badge key={restriction} variant="secondary" className="text-sm">
                        {restriction}
                        <button
                          type="button"
                          onClick={() => removeRestriction(restriction)}
                          className="ml-2 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="allergies">Allergies (Details)</Label>
                <textarea
                  id="allergies"
                  className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
                  placeholder="Detailed allergy information..."
                  value={formData.allergies}
                  onChange={(e) => handleChange('allergies', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Additional Notes</h2>
            <div>
              <Label htmlFor="notes">Internal Notes</Label>
              <textarea
                id="notes"
                className="flex min-h-[100px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
                placeholder="Any additional notes about this customer (preferences, VIP status, etc.)"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                These notes are for internal use only and won&apos;t be visible to the customer
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
            >
              {loading ? 'Creating...' : 'Create Customer'}
            </Button>
            <Link href="/admin/customers">
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
