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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewTablePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    tableNumber: '',
    tableType: 'standard',
    capacityMin: 2,
    capacityMax: 4,
    location: '',
    isActive: true,
    features: [] as string[],
  });

  const [featureInput, setFeatureInput] = useState('');

  const availableFeatures = [
    'Window View',
    'Wheelchair Accessible',
    'High Chair Available',
    'Quiet Area',
    'Near Bar',
    'Outdoor',
    'Private',
    'Booth',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/tables/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create table');
      }

      toast.success('Table created successfully!');
      router.push('/admin/tables');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create table');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addFeature = (feature: string) => {
    if (feature && !formData.features.includes(feature)) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, feature],
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/tables">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Table</h1>
          <p className="text-gray-600 mt-1">Create a new table in your restaurant</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="tableNumber">Table Number *</Label>
                <Input
                  id="tableNumber"
                  value={formData.tableNumber}
                  onChange={(e) => handleChange('tableNumber', e.target.value)}
                  placeholder="e.g., 1, A1, T-01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="tableType">Table Type *</Label>
                <Select
                  value={formData.tableType}
                  onValueChange={(value) => handleChange('tableType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="booth">Booth</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                    <SelectItem value="private">Private Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g., Main Dining, Patio, Bar Area"
                />
              </div>
              <div className="flex items-center justify-between pt-7">
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleChange('isActive', checked)}
                />
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Capacity</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="capacityMin">Minimum Capacity *</Label>
                <Input
                  id="capacityMin"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.capacityMin}
                  onChange={(e) => handleChange('capacityMin', parseInt(e.target.value))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="capacityMax">Maximum Capacity *</Label>
                <Input
                  id="capacityMax"
                  type="number"
                  min={formData.capacityMin}
                  max="20"
                  value={formData.capacityMax}
                  onChange={(e) => handleChange('capacityMax', parseInt(e.target.value))}
                  required
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              This table can accommodate {formData.capacityMin} to {formData.capacityMax} guests
            </p>
          </div>

          {/* Features */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Features & Amenities</h2>
            <div className="space-y-4">
              <div>
                <Label>Quick Add Features</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableFeatures.map((feature) => (
                    <Button
                      key={feature}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addFeature(feature)}
                      disabled={formData.features.includes(feature)}
                    >
                      {feature}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="customFeature">Or Add Custom Feature</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="customFeature"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Enter custom feature"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature(featureInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addFeature(featureInput)}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {formData.features.length > 0 && (
                <div>
                  <Label>Selected Features</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-sm">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="ml-2 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
            >
              {loading ? 'Creating...' : 'Create Table'}
            </Button>
            <Link href="/admin/tables">
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
