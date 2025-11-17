"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Users, ArrowRight, ArrowLeft, Check, Mail, Phone, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Table {
  id: string;
  name: string;
  capacity: number;
  available: boolean;
}

export default function ReservationPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: 2,
    duration: 120,
    tableId: "",
    tableName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    otpVerified: false,
    specialRequests: "",
  });

  const [availableTables, setAvailableTables] = useState<Table[]>([]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  // Simulated table data - in production this would come from the API
  const mockTables: Table[] = [
    { id: "1", name: "Table 1", capacity: 2, available: true },
    { id: "2", name: "Table 2", capacity: 2, available: true },
    { id: "3", name: "Table 3", capacity: 4, available: true },
    { id: "4", name: "Table 4", capacity: 4, available: false },
    { id: "5", name: "Table 5", capacity: 6, available: true },
    { id: "6", name: "Table 6", capacity: 8, available: true },
  ];

  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter tables based on party size
    const filtered = mockTables.filter(
      (table) => table.capacity >= formData.guests && table.available
    );
    setAvailableTables(filtered);
    setStep(2);
  };

  const handleSelectTable = (table: Table) => {
    setFormData({ ...formData, tableId: table.id, tableName: table.name });
    setStep(3);
  };

  const handleSendOTP = () => {
    // In production, this would call an API to send OTP
    console.log("Envoi du code OTP à:", formData.email || formData.phone);
    setOtpSent(true);
  };

  const handleVerifyOTP = () => {
    // In production, this would verify the OTP with the backend
    if (otpCode.length === 6) {
      setFormData({ ...formData, otpVerified: true });
      setStep(4);
    }
  };

  const handleFinalSubmit = async () => {
    // In production, this would create the reservation
    console.log("Réservation finale:", formData);
    alert("Réservation confirmée! Vous recevrez un email de confirmation.");
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
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Nous acceptons les réservations jusqu'à 60 jours à l'avance
                </p>
              </div>

              {/* Sélection de l'Heure */}
              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-restaurant-burgundy" />
                  Heure Préférée
                </Label>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {/* Heures Déjeuner */}
                  <div className="col-span-2 mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Service Déjeuner</p>
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

                  {/* Heures Dîner */}
                  <div className="col-span-2 mb-2 mt-4">
                    <p className="text-sm font-medium text-muted-foreground">Service Dîner</p>
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
                disabled={!formData.date || !formData.time}
              >
                Vérifier la Disponibilité
                <ArrowRight className="ml-2 h-4 w-4" />
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
                          <div className="font-semibold">{table.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Capacité: {table.capacity} personnes
                          </div>
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
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
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
                Téléphone
              </Label>
              <Input
                id="phone"
                type="tel"
                required
                placeholder="+33 6 12 34 56 78"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
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
                disabled={!formData.email || !formData.phone || !formData.firstName || !formData.lastName}
              >
                Envoyer le Code de Vérification
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
                    onChange={(e) => setOtpCode(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Un code a été envoyé à votre email et téléphone
                  </p>
                </div>
                <Button
                  className="w-full bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
                  onClick={handleVerifyOTP}
                  disabled={otpCode.length !== 6}
                >
                  Vérifier et Continuer
                  <ArrowRight className="ml-2 h-4 w-4" />
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
                  <span className="text-muted-foreground">Nom:</span>
                  <span className="font-semibold">
                    {formData.firstName} {formData.lastName}
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
              <h4 className="font-semibold mb-2">Politique d'Annulation</h4>
              <p className="text-sm text-muted-foreground">
                Annulation gratuite jusqu'à 24 heures avant votre réservation.
                Les annulations tardives peuvent entraîner des frais.
              </p>
            </div>

            <Button
              className="w-full bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
              size="lg"
              onClick={handleFinalSubmit}
            >
              <Check className="mr-2 h-5 w-5" />
              Confirmer la Réservation
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setStep(3)}
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
            <li>• Les réservations peuvent être faites jusqu'à 60 jours à l'avance</li>
            <li>• Minimum 2 heures de préavis requis pour les réservations le jour même</li>
            <li>• Les grands groupes (6+) peuvent nécessiter un acompte</li>
            <li>• Annulation gratuite jusqu'à 24 heures avant votre réservation</li>
            <li>• Vous recevrez une confirmation par WhatsApp ou email</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
