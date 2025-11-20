"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Users, PartyPopper, Mail, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EventsPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: 10,
    duration: 180,
    firstName: "",
    email: "",
    phone: "",
    eventType: "",
    // specialRequests: "", // Décommenter pour activer les demandes spéciales
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.guests > 38) {
      toast.error("Le nombre maximum de personnes est de 38");
      return;
    }

    if (formData.guests < 15) {
      toast.error("Pour une privatisation, le minimum est de 15 personnes. Pour moins de personnes, veuillez faire une réservation normale.");
      return;
    }

    setLoading(true);

    try {
      // Simuler l'envoi de la demande
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success("Votre demande de privatisation a été envoyée ! Nous vous contacterons sous 24h.");

      // Reset form
      setFormData({
        date: "",
        time: "",
        guests: 10,
        duration: 180,
        firstName: "",
        email: "",
        phone: "",
        eventType: "",
        // specialRequests: "", // Décommenter pour activer les demandes spéciales
      });
    } catch (error) {
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[400px] items-center justify-center bg-gradient-to-br from-restaurant-burgundy to-restaurant-burgundy/80 px-4 py-20 text-white">
        <div className="container max-w-4xl text-center">
          <PartyPopper className="mx-auto mb-4 h-16 w-16" />
          <h1 className="mb-6 font-serif text-4xl font-bold leading-tight md:text-5xl">
            Événements Privés
          </h1>
          <p className="text-lg text-white/90 md:text-xl">
            Privatisez notre restaurant pour vos événements spéciaux
          </p>
        </div>
      </section>

      {/* Info Section */}
      <section className="container px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold">
              Un Cadre Unique Pour Vos Événements
            </h2>
            <p className="text-lg text-muted-foreground">
              Célébrez vos moments spéciaux dans notre restaurant avec une privatisation complète
            </p>
          </div>

          <div className="mb-12 grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-restaurant-burgundy/10 p-3">
                  <Users className="h-8 w-8 text-restaurant-burgundy" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Capacité</h3>
                <p className="text-muted-foreground">
                  Jusqu&apos;à <strong className="text-restaurant-burgundy">38 personnes</strong><br />
                  (Minimum 15 personnes)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-restaurant-burgundy/10 p-3">
                  <PartyPopper className="h-8 w-8 text-restaurant-burgundy" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Type d&apos;Événements</h3>
                <p className="text-muted-foreground">
                  Anniversaires, mariages, baptêmes,<br />
                  événements d&apos;entreprise, etc.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-restaurant-burgundy/10 p-3">
                  <Clock className="h-8 w-8 text-restaurant-burgundy" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Durée</h3>
                <p className="text-muted-foreground">
                  Privatisation à partir de<br />
                  <strong className="text-restaurant-burgundy">3 heures</strong>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Reservation Form */}
          <Card className="mx-auto max-w-3xl">
            <CardHeader>
              <CardTitle className="font-serif text-2xl">Demande de Privatisation</CardTitle>
              <CardDescription>
                Remplissez ce formulaire et nous vous contactons sous 24h pour confirmer votre événement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date and Time */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date de l&apos;événement *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Heure de début *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="time"
                        type="time"
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Guests and Duration */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="guests">Nombre d&apos;invités *</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="guests"
                        type="number"
                        required
                        min="15"
                        max="38"
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum 15, Maximum 38 personnes
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Durée (minutes) *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <select
                        id="duration"
                        required
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="180">3 heures</option>
                        <option value="240">4 heures</option>
                        <option value="300">5 heures</option>
                        <option value="360">6 heures</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nom complet *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      required
                      placeholder="Jean Dupont"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder="jean@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          required
                          placeholder="0612345678"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Type */}
                <div className="space-y-2">
                  <Label htmlFor="eventType">Type d&apos;événement *</Label>
                  <select
                    id="eventType"
                    required
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="anniversaire">Anniversaire</option>
                    <option value="mariage">Mariage</option>
                    <option value="bapteme">Baptême</option>
                    <option value="communion">Communion</option>
                    <option value="entreprise">Événement d&apos;entreprise</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                {/* Special Requests - Décommenter pour activer */}
                {/* <div className="space-y-2">
                  <Label htmlFor="specialRequests">Demandes spéciales (optionnel)</Label>
                  <textarea
                    id="specialRequests"
                    rows={4}
                    placeholder="Menu spécial, décoration, musique, etc."
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div> */}

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <PartyPopper className="mr-2 h-5 w-5" />
                      Envoyer la Demande
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Nous vous contacterons sous 24h pour confirmer la disponibilité et discuter des détails
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-12">
            <Card className="border-restaurant-burgundy/20 bg-restaurant-burgundy/5">
              <CardContent className="pt-6">
                <h3 className="mb-4 font-semibold">Informations Importantes</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ La privatisation complète du restaurant réserve toutes nos tables</li>
                  <li>✓ Possibilité d&apos;apporter votre décoration</li>
                  <li>✓ Service dédié pour votre événement</li>
                  {/* <li>✓ Un acompte de 30% sera demandé pour confirmer la réservation</li> */}
                  <li>✓ Annulation possible jusqu&apos;à 7 jours avant l&apos;événement</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
