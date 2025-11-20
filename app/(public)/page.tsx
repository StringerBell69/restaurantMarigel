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
            Les Vraies Saveurs du Portugal
          </h1>
          <p className="mb-8 text-lg text-white/90 md:text-xl">
            Savourez une cuisine exceptionnelle préparée avec passion et servie
            avec élégance. Réservez votre table pour une expérience culinaire
            inoubliable.
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
                className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-restaurant-burgundy focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-restaurant-burgundy transition-all duration-200"
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
              <h3 className="mb-2 text-xl font-semibold">Cuisine Authentique Portugaise</h3>
              <p className="text-muted-foreground">
                Des plats traditionnels préparés avec passion et savoir-faire
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-restaurant-burgundy/10 p-3">
                <Heart className="h-8 w-8 text-restaurant-burgundy" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Service Exceptionnel
              </h3>
              <p className="text-muted-foreground">
                Un service familial et convivial pour vous sentir comme à la maison
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-restaurant-burgundy/10 p-3">
                <Award className="h-8 w-8 text-restaurant-burgundy" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Saveurs du Portugal</h3>
              <p className="text-muted-foreground">
                Découvrez les vraies recettes portugaises dans une ambiance authentique
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
              Pourquoi Choisir SABORES DE PORTUGAL?
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              Une cuisine familiale portugaise authentique, préparée avec amour selon les
              recettes traditionnelles pour des saveurs qui vous transportent au Portugal
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border bg-background p-6">
                <Clock className="mb-3 h-8 w-8 text-restaurant-burgundy" />
                <h3 className="mb-2 font-semibold">Réservations Faciles</h3>
                <p className="text-sm text-muted-foreground">
                  Réservez votre table en ligne en quelques minutes avec notre
                  système de réservation avancé
                </p>
              </div>

              <div className="rounded-lg border bg-background p-6">
                <Users className="mb-3 h-8 w-8 text-restaurant-burgundy" />
                <h3 className="mb-2 font-semibold">Événements Privés</h3>
                <p className="text-sm text-muted-foreground">
                  Parfait pour les célébrations, les dîners d&apos;affaires et
                  les occasions spéciales
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
            Réservez votre table maintenant et savourez les vraies saveurs du Portugal
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
                26b rue Joseph Longarini<br />
                69700 Givors
              </p>
            </div>

            <div className="text-center">
              <h3 className="mb-2 font-semibold">Horaires</h3>
              <p className="text-sm text-muted-foreground">
                Déjeuner: 11h00 - 15h00
                <br />
                Dîner: 18h00 - 23h00
              </p>
            </div>

            <div className="text-center">
              <h3 className="mb-2 font-semibold">Contact</h3>
              <p className="text-sm text-muted-foreground">
                Téléphone: 07 53 45 49 16
                <br />
                Email: info@sumbo.fr
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
