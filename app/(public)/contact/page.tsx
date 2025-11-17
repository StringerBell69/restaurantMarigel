"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Message envoyé:", formData);
    alert("Merci pour votre message! Nous vous répondrons dans les plus brefs délais.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[300px] items-center justify-center bg-gradient-to-br from-restaurant-burgundy to-restaurant-burgundy/80 px-4 py-16 text-white">
        <div className="container max-w-4xl text-center">
          <h1 className="mb-4 font-serif text-4xl font-bold leading-tight md:text-5xl">
            Contactez-Nous
          </h1>
          <p className="text-lg text-white/90">
            Nous sommes à votre écoute pour toute question ou demande
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="container px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-restaurant-burgundy/10 p-3">
                <MapPin className="h-6 w-6 text-restaurant-burgundy" />
              </div>
              <h3 className="mb-2 font-semibold">Adresse</h3>
              <p className="text-sm text-muted-foreground">
                123 Rue de la Gastronomie<br />
                Centre-ville, Paris 75001<br />
                France
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-restaurant-burgundy/10 p-3">
                <Phone className="h-6 w-6 text-restaurant-burgundy" />
              </div>
              <h3 className="mb-2 font-semibold">Téléphone</h3>
              <p className="text-sm text-muted-foreground">
                +33 1 23 45 67 89<br />
                +33 6 12 34 56 78<br />
                (Lun-Sam 10h-22h)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-restaurant-burgundy/10 p-3">
                <Mail className="h-6 w-6 text-restaurant-burgundy" />
              </div>
              <h3 className="mb-2 font-semibold">Email</h3>
              <p className="text-sm text-muted-foreground">
                info@sumbo.fr<br />
                reservations@sumbo.fr<br />
                chef@sumbo.fr
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-restaurant-burgundy/10 p-3">
                <Clock className="h-6 w-6 text-restaurant-burgundy" />
              </div>
              <h3 className="mb-2 font-semibold">Horaires</h3>
              <p className="text-sm text-muted-foreground">
                Déjeuner: 11h00 - 15h00<br />
                Dîner: 18h00 - 23h00<br />
                Fermé le lundi
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-restaurant-burgundy" />
                  <CardTitle className="font-serif text-2xl">Envoyez-nous un Message</CardTitle>
                </div>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom Complet</Label>
                    <Input
                      id="name"
                      required
                      placeholder="Jean Dupont"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="jean@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input
                      id="subject"
                      required
                      placeholder="Demande de renseignements"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Votre message..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Envoyer le Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="container px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-center font-serif text-3xl font-bold">Comment Nous Trouver</h2>
          <div className="overflow-hidden rounded-lg border">
            {/* Placeholder for map - in production, integrate Google Maps or similar */}
            <div className="flex h-[400px] items-center justify-center bg-muted">
              <div className="text-center">
                <MapPin className="mx-auto mb-4 h-12 w-12 text-restaurant-burgundy" />
                <p className="text-lg font-semibold">123 Rue de la Gastronomie</p>
                <p className="text-muted-foreground">Centre-ville, Paris 75001, France</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="border-t bg-muted/50 py-12">
        <div className="container px-4">
          <Card className="mx-auto max-w-4xl border-restaurant-burgundy/20 bg-restaurant-burgundy/5">
            <CardContent className="pt-6">
              <h3 className="mb-4 font-semibold">Informations Utiles</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-medium">Réservations</h4>
                  <p className="text-sm text-muted-foreground">
                    Pour les réservations, utilisez notre système en ligne ou appelez-nous
                    directement. Les réservations sont recommandées, surtout pour les week-ends.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">Événements Privés</h4>
                  <p className="text-sm text-muted-foreground">
                    Nous organisons des événements privés pour 20 à 100 personnes.
                    Contactez-nous pour discuter de vos besoins spécifiques.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">Parking</h4>
                  <p className="text-sm text-muted-foreground">
                    Parking public disponible à 100 mètres du restaurant.
                    Service de voiturier disponible sur demande.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">Accessibilité</h4>
                  <p className="text-sm text-muted-foreground">
                    Notre restaurant est entièrement accessible aux personnes à mobilité réduite.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
