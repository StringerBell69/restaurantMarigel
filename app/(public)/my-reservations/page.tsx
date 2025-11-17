"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Mail, Phone, Search, X, MapPin } from "lucide-react";

interface Reservation {
  id: string;
  date: string;
  time: string;
  guests: number;
  tableName: string;
  status: "confirmed" | "pending" | "cancelled";
  reservationNumber: string;
}

export default function MyReservationsPage() {
  const [searchType, setSearchType] = useState<"email" | "phone">("email");
  const [searchValue, setSearchValue] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searched, setSearched] = useState(false);

  // Mock data for demonstration
  const mockReservations: Reservation[] = [
    {
      id: "1",
      date: "2025-11-25",
      time: "19:00",
      guests: 4,
      tableName: "Table 5",
      status: "confirmed",
      reservationNumber: "RES-2025-001",
    },
    {
      id: "2",
      date: "2025-12-15",
      time: "20:00",
      guests: 2,
      tableName: "Table 2",
      status: "pending",
      reservationNumber: "RES-2025-002",
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would call an API to fetch reservations
    setReservations(mockReservations);
    setSearched(true);
  };

  const handleCancelReservation = (id: string) => {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir annuler cette réservation? Cette action est irréversible."
    );
    if (confirmed) {
      setReservations(
        reservations.map((res) =>
          res.id === id ? { ...res, status: "cancelled" as const } : res
        )
      );
      alert("Votre réservation a été annulée.");
    }
  };

  const getStatusBadge = (status: Reservation["status"]) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmée</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">En Attente</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Annulée</Badge>;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[300px] items-center justify-center bg-gradient-to-br from-restaurant-burgundy to-restaurant-burgundy/80 px-4 py-16 text-white">
        <div className="container max-w-4xl text-center">
          <h1 className="mb-4 font-serif text-4xl font-bold leading-tight md:text-5xl">
            Mes Réservations
          </h1>
          <p className="text-lg text-white/90">
            Consultez et gérez vos réservations en toute simplicité
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="container px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="h-6 w-6 text-restaurant-burgundy" />
                <CardTitle className="font-serif text-2xl">Rechercher Mes Réservations</CardTitle>
              </div>
              <CardDescription>
                Entrez votre email ou numéro de téléphone pour voir vos réservations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="space-y-2">
                  <Label>Type de Recherche</Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={searchType === "email" ? "default" : "outline"}
                      onClick={() => setSearchType("email")}
                      className="flex-1"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </Button>
                    <Button
                      type="button"
                      variant={searchType === "phone" ? "default" : "outline"}
                      onClick={() => setSearchType("phone")}
                      className="flex-1"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Téléphone
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search">
                    {searchType === "email" ? "Adresse Email" : "Numéro de Téléphone"}
                  </Label>
                  <Input
                    id="search"
                    type={searchType === "email" ? "email" : "tel"}
                    required
                    placeholder={
                      searchType === "email"
                        ? "votre@email.com"
                        : "+33 6 12 34 56 78"
                    }
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Rechercher
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Reservations List */}
      {searched && (
        <section className="container px-4 pb-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 font-serif text-2xl font-bold">
              Vos Réservations ({reservations.length})
            </h2>

            {reservations.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-lg font-semibold">Aucune réservation trouvée</p>
                  <p className="text-muted-foreground">
                    Vous n'avez pas encore de réservation avec cette adresse email/téléphone
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <Card key={reservation.id}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono">
                              {reservation.reservationNumber}
                            </Badge>
                            {getStatusBadge(reservation.status)}
                          </div>

                          <div className="grid gap-2 sm:grid-cols-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-restaurant-burgundy" />
                              <span>
                                {new Date(reservation.date).toLocaleDateString("fr-FR", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-restaurant-burgundy" />
                              <span>{reservation.time}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-restaurant-burgundy" />
                              <span>{reservation.guests} personnes</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-restaurant-burgundy" />
                              <span>{reservation.tableName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {reservation.status === "confirmed" && (
                            <>
                              <Button variant="outline" size="sm">
                                Modifier
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => handleCancelReservation(reservation.id)}
                              >
                                <X className="mr-1 h-4 w-4" />
                                Annuler
                              </Button>
                            </>
                          )}
                          {reservation.status === "pending" && (
                            <Badge variant="secondary">En cours de confirmation</Badge>
                          )}
                          {reservation.status === "cancelled" && (
                            <Badge variant="secondary">Annulée</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Info Section */}
      <section className="border-t bg-muted/50 py-12">
        <div className="container px-4">
          <Card className="mx-auto max-w-4xl border-restaurant-burgundy/20 bg-restaurant-burgundy/5">
            <CardContent className="pt-6">
              <h3 className="mb-4 font-semibold">Politique de Réservation</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • <strong>Annulation:</strong> Annulation gratuite jusqu'à 24 heures avant votre réservation
                </li>
                <li>
                  • <strong>Modification:</strong> Vous pouvez modifier votre réservation jusqu'à 12 heures avant
                </li>
                <li>
                  • <strong>Retard:</strong> Veuillez nous informer si vous avez plus de 15 minutes de retard
                </li>
                <li>
                  • <strong>Grands groupes:</strong> Les groupes de 6+ personnes peuvent nécessiter un acompte
                </li>
                <li>
                  • <strong>Confirmation:</strong> Vous recevrez une confirmation par email et/ou WhatsApp
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
