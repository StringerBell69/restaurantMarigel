import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Award, Heart, Users, ChefHat, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[400px] items-center justify-center bg-gradient-to-br from-restaurant-burgundy to-restaurant-burgundy/80 px-4 py-20 text-white">
        <div className="container max-w-4xl text-center">
          <h1 className="mb-6 font-serif text-5xl font-bold leading-tight md:text-6xl">
            À Propos de Marigel
          </h1>
          <p className="text-lg text-white/90 md:text-xl">
            Une histoire de passion, d'excellence et de tradition culinaire française
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="container px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 font-serif text-3xl font-bold md:text-4xl">Notre Histoire</h2>
          <div className="space-y-4 text-lg text-muted-foreground">
            <p>
              Fondé en 1985, le Restaurant Marigel est devenu une institution de la gastronomie française.
              Notre histoire commence avec Chef Pierre Marigel, qui a ouvert ce restaurant avec une vision
              simple : créer des expériences culinaires inoubliables en combinant tradition et innovation.
            </p>
            <p>
              Pendant plus de trois décennies, nous avons perfectionné notre art, en utilisant uniquement
              les meilleurs ingrédients locaux et de saison. Notre engagement envers l'excellence nous a
              valu de nombreux prix et la reconnaissance de nos pairs dans l'industrie culinaire.
            </p>
            <p>
              Aujourd'hui, sous la direction du Chef exécutif Marie Dubois, nous continuons à honorer
              l'héritage de notre fondateur tout en repoussant les limites de la créativité culinaire.
              Chaque plat raconte une histoire, chaque repas est une célébration.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container px-4">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold md:text-4xl">
            Nos Valeurs
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-restaurant-burgundy/10 p-3">
                  <Award className="h-8 w-8 text-restaurant-burgundy" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Excellence</h3>
                <p className="text-muted-foreground">
                  Nous ne faisons aucun compromis sur la qualité. Chaque détail compte,
                  de la sélection des ingrédients à la présentation finale.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-restaurant-burgundy/10 p-3">
                  <Heart className="h-8 w-8 text-restaurant-burgundy" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Passion</h3>
                <p className="text-muted-foreground">
                  Notre amour pour la cuisine française transparaît dans chaque plat que nous servons.
                  C'est plus qu'un travail, c'est notre vocation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-restaurant-burgundy/10 p-3">
                  <Sparkles className="h-8 w-8 text-restaurant-burgundy" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Innovation</h3>
                <p className="text-muted-foreground">
                  Tout en respectant la tradition, nous explorons constamment de nouvelles techniques
                  et saveurs pour surprendre et ravir nos convives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold md:text-4xl">
            Notre Équipe
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-restaurant-burgundy/10 p-2">
                  <ChefHat className="h-6 w-6 text-restaurant-burgundy" />
                </div>
                <div>
                  <h3 className="font-semibold">Chef Marie Dubois</h3>
                  <p className="text-sm text-muted-foreground">Chef Exécutif</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Avec plus de 20 ans d'expérience dans les restaurants étoilés Michelin,
                Chef Marie apporte son expertise et sa créativité à chaque plat de notre menu.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-restaurant-burgundy/10 p-2">
                  <ChefHat className="h-6 w-6 text-restaurant-burgundy" />
                </div>
                <div>
                  <h3 className="font-semibold">Chef Antoine Laurent</h3>
                  <p className="text-sm text-muted-foreground">Sous-Chef</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Formé dans les meilleures écoles culinaires de France, Antoine coordonne
                notre brigade avec précision et passion.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-restaurant-burgundy/10 p-2">
                  <Users className="h-6 w-6 text-restaurant-burgundy" />
                </div>
                <div>
                  <h3 className="font-semibold">Sophie Martin</h3>
                  <p className="text-sm text-muted-foreground">Directrice de Salle</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Sophie et son équipe veillent à ce que chaque convive bénéficie d'un service
                irréprochable et d'une expérience mémorable.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-restaurant-burgundy/10 p-2">
                  <Award className="h-6 w-6 text-restaurant-burgundy" />
                </div>
                <div>
                  <h3 className="font-semibold">Jean-Pierre Moreau</h3>
                  <p className="text-sm text-muted-foreground">Sommelier</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Notre sommelier expert sélectionne les meilleurs vins pour accompagner
                parfaitement chaque plat de notre menu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-12 font-serif text-3xl font-bold md:text-4xl">
              Nos Distinctions
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border bg-background p-6">
                <Award className="mx-auto mb-3 h-8 w-8 text-restaurant-burgundy" />
                <h3 className="mb-2 font-semibold">Guide Michelin</h3>
                <p className="text-sm text-muted-foreground">
                  Recommandé par le Guide Michelin depuis 1995
                </p>
              </div>

              <div className="rounded-lg border bg-background p-6">
                <Award className="mx-auto mb-3 h-8 w-8 text-restaurant-burgundy" />
                <h3 className="mb-2 font-semibold">Prix d'Excellence</h3>
                <p className="text-sm text-muted-foreground">
                  Wine Spectator Award of Excellence 2020-2024
                </p>
              </div>

              <div className="rounded-lg border bg-background p-6">
                <Award className="mx-auto mb-3 h-8 w-8 text-restaurant-burgundy" />
                <h3 className="mb-2 font-semibold">Meilleur Restaurant</h3>
                <p className="text-sm text-muted-foreground">
                  Élu "Meilleur Restaurant de la Ville" 5 années consécutives
                </p>
              </div>

              <div className="rounded-lg border bg-background p-6">
                <Award className="mx-auto mb-3 h-8 w-8 text-restaurant-burgundy" />
                <h3 className="mb-2 font-semibold">Chef de l'Année</h3>
                <p className="text-sm text-muted-foreground">
                  Chef Marie Dubois - Prix Gault & Millau 2023
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-16">
        <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-restaurant-burgundy to-restaurant-burgundy/90 p-12 text-center text-white">
          <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">
            Rejoignez Notre Histoire
          </h2>
          <p className="mb-8 text-lg text-white/90">
            Réservez votre table et découvrez pourquoi nous sommes l'un des restaurants
            les plus appréciés de la région
          </p>
          <Link href="/reservation">
            <Button
              size="lg"
              className="bg-white text-restaurant-burgundy hover:bg-white/90"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Réserver Maintenant
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
