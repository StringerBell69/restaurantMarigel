"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Users, ArrowRight, ArrowLeft, Check, Mail, Phone, MapPin, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { generateTimeSlots, isRestaurantOpen, getNextAvailableDate } from "@/lib/restaurant-hours";

interface Table {
  id: string;
  name: string;
  tableNumber: number;
  capacity: number;
  capacityMin: number;
  location?: string;
  features?: string[];
  available: boolean;
  needsExtraChair?: boolean;
  comfortNote?: string | null;
}

export default function ReservationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: 2,
    duration: 120,
    tableId: "",
    tableName: "",
    firstName: "",
    lastName: "", // Will be set to empty string but not used in form
    email: "",
    phone: "",
    otpVerified: false,
    specialRequests: "",
  });

  const [availableTables, setAvailableTables] = useState<Table[]>([]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [canResendOTP, setCanResendOTP] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isDateClosed, setIsDateClosed] = useState(false);
  const [maxBookingDays, setMaxBookingDays] = useState(60); // Default to 60 days

  // Fetch max booking days setting on mount
  useEffect(() => {
    const fetchMaxBookingDays = async () => {
      try {
        const response = await fetch('/api/settings/max-booking-days');
        const data = await response.json();
        if (data.success && data.maxDays) {
          setMaxBookingDays(data.maxDays);
        }
      } catch (error) {
        console.error('Failed to fetch max booking days:', error);
        // Keep default value of 60
      }
    };
    fetchMaxBookingDays();
  }, []);

  // Update available time slots when date changes
  useEffect(() => {
    if (formData.date) {
      const selectedDate = new Date(formData.date + 'T00:00:00');

      if (isRestaurantOpen(selectedDate)) {
        const slots = generateTimeSlots(selectedDate);
        setAvailableTimeSlots(slots);
        setIsDateClosed(false);

        // Reset time if current selection is not available
        if (formData.time && !slots.includes(formData.time)) {
          setFormData({ ...formData, time: "" });
        }
      } else {
        setAvailableTimeSlots([]);
        setIsDateClosed(true);
        setFormData({ ...formData, time: "" });
      }
    }
  }, [formData.date]);

  // Step 1: Check availability
  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `/api/tables/availability?date=${formData.date}&time=${formData.time}&guests=${formData.guests}&duration=${formData.duration}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la vérification de la disponibilité');
      }

      if (data.availableTables.length === 0) {
        toast.error('Aucune table disponible pour votre sélection');
        return;
      }

      setAvailableTables(data.availableTables);
      setStep(2);
      toast.success(`${data.totalAvailable} table(s) disponible(s)`);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la vérification de la disponibilité');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Select table
  const handleSelectTable = (table: Table) => {
    setFormData({ ...formData, tableId: table.id, tableName: table.name });
    setStep(3);
    toast.success(`Table ${table.tableNumber} sélectionnée`);
  };

  // Step 3: Send OTP
  const handleSendOTP = async () => {
    if (formData.phone.length !== 10) {
      toast.error('Le numéro de téléphone doit contenir exactement 10 chiffres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          firstName: formData.firstName,
          lastName: formData.firstName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi du code');
      }

      setOtpSent(true);
      setCanResendOTP(false);

      // Enable resend after 30 seconds
      setTimeout(() => {
        setCanResendOTP(true);
      }, 30000);

      toast.success('Code de vérification envoyé !');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'envoi du code');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Verify OTP
  const handleVerifyOTP = async () => {
    if (otpCode.length !== 6) {
      toast.error('Le code doit contenir 6 chiffres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: otpCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Code invalide');
      }

      setFormData({ ...formData, otpVerified: true });
      setStep(4);
      toast.success('Code vérifié avec succès !');
    } catch (error: any) {
      toast.error(error.message || 'Code invalide');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Final submission
  const handleFinalSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/reservations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formData.date,
          time: formData.time,
          guests: formData.guests,
          duration: formData.duration,
          tableId: formData.tableId,
          tableName: formData.tableName,
          firstName: formData.firstName,
          lastName: formData.firstName,
          email: formData.email,
          phone: formData.phone,
          specialRequests: formData.specialRequests,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la réservation');
      }

      // Redirect to success page with reservation details
      router.push(`/reservation/success?number=${data.reservation.reservationNumber}`);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création de la réservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl px-4 py-12">
      {/* Indicateur de Progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: "Date & Heure" },
            { num: 2, label: "Choisir Table" },
            { num: 3, label: "Vos Coordonnées" },
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

      {/* Étape 1: Date, Heure et Nombre de Personnes */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Réservez Votre Table</CardTitle>
            <CardDescription>
              Sélectionnez votre date, heure et nombre de convives préférés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheckAvailability} className="space-y-6">
              {/* Sélection de la Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-restaurant-burgundy" />
                  Date de Réservation
                </Label>
                <Input
                  id="date"
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  max={new Date(Date.now() + maxBookingDays * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Nous acceptons les réservations jusqu&apos;à {maxBookingDays} jours à l&apos;avance
                </p>
              </div>

              {/* Sélection de l'Heure */}
              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-restaurant-burgundy" />
                  Heure Préférée
                </Label>
                {!formData.date ? (
                  <div className="flex items-center gap-2 rounded-md border border-dashed border-muted-foreground/50 p-4 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    Veuillez d&apos;abord sélectionner une date
                  </div>
                ) : isDateClosed ? (
                  <div className="flex items-center gap-2 rounded-md border border-orange-500/50 bg-orange-50 p-4 text-sm text-orange-700">
                    <AlertCircle className="h-4 w-4" />
                    Le restaurant est fermé ce jour-là (fermé lundi et mercredi)
                  </div>
                ) : availableTimeSlots.length === 0 ? (
                  <div className="flex items-center gap-2 rounded-md border border-muted-foreground/50 p-4 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    Aucun créneau disponible pour cette date
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
                    {availableTimeSlots.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={formData.time === time ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setFormData({ ...formData, time })}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.date && !isDateClosed && (
                    <>
                      {new Date(formData.date + 'T00:00:00').getDay() === 0
                        ? 'Dimanche: 12h00 - 17h00'
                        : 'Horaires: 11h00 - 22h00'}
                    </>
                  )}
                </p>
              </div>

              {/* Nombre de Convives */}
              <div className="space-y-2">
                <Label htmlFor="guests" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-restaurant-burgundy" />
                  Nombre de Convives
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
                    Grand groupe - un acompte peut être requis
                  </Badge>
                )}
              </div>

              {/* Durée */}
              <div className="space-y-2">
                <Label>Durée du Repas</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Rapide (1.5h)", value: 90 },
                    { label: "Standard (2h)", value: 120 },
                    { label: "Prolongé (3h)", value: 180 },
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

              {/* Soumettre */}
              <Button
                type="submit"
                className="w-full bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
                size="lg"
                disabled={!formData.date || !formData.time || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  <>
                    Vérifier la Disponibilité
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Étape 2: Sélection de Table */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Choisissez Votre Table</CardTitle>
            <CardDescription>
              Tables disponibles pour {formData.guests} personnes le {new Date(formData.date).toLocaleDateString('fr-FR')} à {formData.time}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableTables.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Désolé, aucune table disponible pour votre sélection. Veuillez choisir une autre date ou heure.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
              </div>
            ) : (
              <>
                <div className="grid gap-3">
                  {availableTables.map((table) => (
                    <Button
                      key={table.id}
                      variant="outline"
                      className="h-auto justify-between p-4 hover:border-restaurant-burgundy"
                      onClick={() => handleSelectTable(table)}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-restaurant-burgundy" />
                        <div className="text-left">
                          <div className="font-semibold">Table {table.tableNumber}</div>
                          <div className="text-sm text-muted-foreground">
                            Capacité: {table.capacity} personnes
                            {table.location && ` • ${table.location}`}
                          </div>
                          {table.needsExtraChair && table.comfortNote && (
                            <div className="mt-1 text-xs text-orange-600">
                              ⚠️ {table.comfortNote}
                            </div>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Étape 3: Coordonnées Client */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Vos Coordonnées</CardTitle>
            <CardDescription>
              Nous avons besoin de vos informations pour confirmer votre réservation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-restaurant-burgundy" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-restaurant-burgundy" />
                Téléphone (10 chiffres)
              </Label>
              <Input
                id="phone"
                type="tel"
                required
                placeholder="0612345678"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, phone: value });
                }}
              />
              {formData.phone && formData.phone.length !== 10 && formData.phone.length > 0 && (
                <p className="text-xs text-red-500">Le numéro doit contenir exactement 10 chiffres</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequests">Demandes Spéciales (Optionnel)</Label>
              <Input
                id="specialRequests"
                placeholder="Allergies, préférences de sièges, etc."
                value={formData.specialRequests}
                onChange={(e) =>
                  setFormData({ ...formData, specialRequests: e.target.value })
                }
              />
            </div>

            {!otpSent ? (
              <Button
                className="w-full bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
                onClick={handleSendOTP}
                disabled={!formData.email || !formData.phone || formData.phone.length !== 10 || !formData.firstName || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  "Envoyer le Code de Vérification"
                )}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Code de Vérification</Label>
                  <Input
                    id="otp"
                    placeholder="Entrez le code à 6 chiffres"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <p>Un code a été envoyé à votre email</p>
                    {canResendOTP && (
                      <button
                        type="button"
                        onClick={() => {
                          setOtpCode("");
                          setOtpSent(false);
                        }}
                        className="text-restaurant-burgundy hover:underline font-medium"
                      >
                        Renvoyer le code
                      </button>
                    )}
                  </div>
                </div>
                <Button
                  className="w-full bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
                  onClick={handleVerifyOTP}
                  disabled={otpCode.length !== 6 || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    <>
                      Vérifier et Continuer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setStep(2)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Étape 4: Confirmation */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Confirmez Votre Réservation</CardTitle>
            <CardDescription>
              Veuillez vérifier tous les détails avant de confirmer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-semibold">
                  {new Date(formData.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Heure:</span>
                <span className="font-semibold">{formData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Table:</span>
                <span className="font-semibold">{formData.tableName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Convives:</span>
                <span className="font-semibold">{formData.guests} personnes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Durée:</span>
                <span className="font-semibold">{formData.duration} minutes</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prénom:</span>
                  <span className="font-semibold">
                    {formData.firstName}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-semibold">{formData.email}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-muted-foreground">Téléphone:</span>
                  <span className="font-semibold">{formData.phone}</span>
                </div>
                {formData.specialRequests && (
                  <div className="flex justify-between mt-2">
                    <span className="text-muted-foreground">Demandes:</span>
                    <span className="font-semibold">{formData.specialRequests}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-restaurant-burgundy/20 bg-restaurant-burgundy/5 p-4">
              <h4 className="font-semibold mb-2">Politique d&apos;Annulation</h4>
              <p className="text-sm text-muted-foreground">
                Annulation gratuite jusqu&apos;à 24 heures avant votre réservation.
                Les annulations tardives peuvent entraîner des frais.
              </p>
            </div>

            <Button
              className="w-full bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
              size="lg"
              onClick={handleFinalSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Confirmer la Réservation
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setStep(3)}
              disabled={loading}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Carte Informations */}
      <Card className="mt-6 border-restaurant-burgundy/20 bg-restaurant-burgundy/5">
        <CardContent className="pt-6">
          <h3 className="mb-2 font-semibold">Informations sur la Réservation</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Les réservations peuvent être faites jusqu&apos;à 60 jours à l&apos;avance</li>
            <li>• Minimum 2 heures de préavis requis pour les réservations le jour même</li>
            <li>• Les grands groupes (6+) peuvent nécessiter un acompte</li>
            <li>• Annulation gratuite jusqu&apos;à 24 heures avant votre réservation</li>
            <li>• Vous recevrez une confirmation par WhatsApp ou email</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
