"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ReservationPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: 2,
    duration: 120,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would proceed to the next step in the reservation flow
    console.log("Form data:", formData);
  };

  return (
    <div className="container max-w-4xl px-4 py-12">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: "Date & Time" },
            { num: 2, label: "Select Table" },
            { num: 3, label: "Your Details" },
            { num: 4, label: "Confirmation" },
          ].map((item, index) => (
            <div key={item.num} className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  step >= item.num
                    ? "border-restaurant-burgundy bg-restaurant-burgundy text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {item.num}
              </div>
              <span
                className={`ml-2 hidden text-sm md:inline ${
                  step >= item.num ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
              {index < 3 && (
                <div
                  className={`mx-2 h-0.5 w-12 md:w-24 ${
                    step > item.num ? "bg-restaurant-burgundy" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Date, Time, and Party Size */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Reserve Your Table</CardTitle>
            <CardDescription>
              Select your preferred date, time, and party size
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-restaurant-burgundy" />
                  Reservation Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  We accept reservations up to 60 days in advance
                </p>
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-restaurant-burgundy" />
                  Preferred Time
                </Label>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {/* Lunch Times */}
                  <div className="col-span-2 mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Lunch Service</p>
                  </div>
                  {["11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30"].map(
                    (time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={formData.time === time ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setFormData({ ...formData, time })}
                      >
                        {time}
                      </Button>
                    )
                  )}

                  {/* Dinner Times */}
                  <div className="col-span-2 mb-2 mt-4">
                    <p className="text-sm font-medium text-muted-foreground">Dinner Service</p>
                  </div>
                  {["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"].map(
                    (time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={formData.time === time ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setFormData({ ...formData, time })}
                      >
                        {time}
                      </Button>
                    )
                  )}
                </div>
              </div>

              {/* Party Size */}
              <div className="space-y-2">
                <Label htmlFor="guests" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-restaurant-burgundy" />
                  Number of Guests
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        guests: Math.max(1, formData.guests - 1),
                      })
                    }
                  >
                    -
                  </Button>
                  <span className="text-2xl font-semibold w-12 text-center">
                    {formData.guests}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        guests: Math.min(20, formData.guests + 1),
                      })
                    }
                  >
                    +
                  </Button>
                </div>
                {formData.guests >= 6 && (
                  <Badge variant="secondary" className="mt-2">
                    Large party - deposit may be required
                  </Badge>
                )}
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label>Dining Duration</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Quick (1.5h)", value: 90 },
                    { label: "Standard (2h)", value: 120 },
                    { label: "Extended (3h)", value: 180 },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={formData.duration === option.value ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, duration: option.value })}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
                size="lg"
                disabled={!formData.date || !formData.time}
              >
                Check Availability
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="mt-6 border-restaurant-burgundy/20 bg-restaurant-burgundy/5">
        <CardContent className="pt-6">
          <h3 className="mb-2 font-semibold">Reservation Information</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Reservations can be made up to 60 days in advance</li>
            <li>• Minimum 2 hours notice required for same-day bookings</li>
            <li>• Large parties (6+) may require a deposit</li>
            <li>• Free cancellation up to 24 hours before your reservation</li>
            <li>• You'll receive a confirmation via WhatsApp or email</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
