import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Users, Star, Award, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[600px] items-center justify-center bg-gradient-to-br from-restaurant-burgundy to-restaurant-burgundy/80 px-4 py-20 text-white">
        <div className="container max-w-4xl text-center">
          <h1 className="mb-6 font-serif text-5xl font-bold leading-tight md:text-7xl">
            Découvrez l'Excellence Gastronomique
          </h1>
          <p className="mb-8 text-lg text-white/90 md:text-xl">
            Savourez une cuisine exceptionnelle préparée avec passion et servie avec élégance.
            Réservez votre table pour une expérience culinaire inoubliable.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/reservation">
              <Button
                size="lg"
                className="bg-white text-restaurant-burgundy hover:bg-white/90"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Réserver une Table
              </Button>
            </Link>
            <Link href="/menu">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Voir le Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-restaurant-burgundy/10 p-3">
                <Star className="h-8 w-8 text-restaurant-burgundy" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Qualité Michelin</h3>
              <p className="text-muted-foreground">
                Une cuisine primée préparée par notre équipe culinaire experte
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-restaurant-burgundy/10 p-3">
                <Heart className="h-8 w-8 text-restaurant-burgundy" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Service Exceptionnel</h3>
              <p className="text-muted-foreground">
                Une équipe attentive dédiée à rendre votre expérience parfaite
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-restaurant-burgundy/10 p-3">
                <Award className="h-8 w-8 text-restaurant-burgundy" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Ambiance Élégante</h3>
              <p className="text-muted-foreground">
                Un cadre magnifique parfait pour toute occasion spéciale
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">
              Pourquoi Choisir Marigel?
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Nous combinons les techniques culinaires traditionnelles avec l'innovation moderne
              pour créer des expériences gastronomiques mémorables
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border bg-background p-6">
                <Clock className="mb-3 h-8 w-8 text-restaurant-burgundy" />
                <h3 className="mb-2 font-semibold">Réservations Faciles</h3>
                <p className="text-sm text-muted-foreground">
                  Réservez votre table en ligne en quelques minutes avec notre système de réservation avancé
                </p>
              </div>

              <div className="rounded-lg border bg-background p-6">
                <Users className="mb-3 h-8 w-8 text-restaurant-burgundy" />
                <h3 className="mb-2 font-semibold">Événements Privés</h3>
                <p className="text-sm text-muted-foreground">
                  Parfait pour les célébrations, les dîners d'affaires et les occasions spéciales
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container px-4 py-16">
        <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-restaurant-burgundy to-restaurant-burgundy/90 p-12 text-center text-white">
          <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">
            Prêt à Dîner avec Nous?
          </h2>
          <p className="mb-8 text-lg text-white/90">
            Réservez votre table maintenant et découvrez l'excellence culinaire
          </p>
          <Link href="/reservation">
            <Button
              size="lg"
              className="bg-white text-restaurant-burgundy hover:bg-white/90"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Réservez Votre Table
            </Button>
          </Link>
        </div>
      </section>

      {/* Info Section */}
      <section className="border-t py-12">
        <div className="container px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <h3 className="mb-2 font-semibold">Emplacement</h3>
              <p className="text-sm text-muted-foreground">
                123 Rue de la Gastronomie<br />
                Centre-ville, Paris 75001
              </p>
            </div>

            <div className="text-center">
              <h3 className="mb-2 font-semibold">Horaires</h3>
              <p className="text-sm text-muted-foreground">
                Déjeuner: 11h00 - 15h00<br />
                Dîner: 18h00 - 23h00
              </p>
            </div>

            <div className="text-center">
              <h3 className="mb-2 font-semibold">Contact</h3>
              <p className="text-sm text-muted-foreground">
                Téléphone: +33 1 23 45 67 89<br />
                Email: info@restaurantmarigel.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
