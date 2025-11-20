import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Wine, Coffee } from "lucide-react";

export default function MenuPage() {
  const starters = [
    {
      name: "Pataniscas",
      description: "Beignets de morue traditionnels portugais",
      price: "5€",
    },
    {
      name: "Planche de Fromages Portugais",
      description: "Sélection de fromages artisanaux du Portugal",
      price: "13€",
    },
    {
      name: "Planche de Charcuterie Portugaise",
      description: "Assortiment de charcuteries traditionnelles",
      price: "13€",
    },
  ];

  const mains = [
    {
      name: "Bacalhau à Braga",
      description: "Morue traditionnelle préparée à la mode de Braga",
      price: "22,50€",
      badge: "Spécialité",
    },
    {
      name: "Bacalhau Braisé",
      description: "Morue braisée avec pommes de terre et oignons",
      price: "22,50€",
      badge: "Spécialité",
    },
    {
      name: "Bitoque de Veau",
      description: "Steak de veau avec œuf au plat, frites et salade",
      price: "17€",
    },
    {
      name: "Bitoque de Porc",
      description: "Steak de porc avec œuf au plat, frites et salade",
      price: "15€",
    },
  ];

  const drinks = [
    {
      name: "Vins Portugais",
      description: "Sélection de vins rouges, blancs et verts portugais",
      price: "15€",
      badge: "Bouteille",
    },
    {
      name: "Jus Portugais Variés",
      description: "Jus de fruits naturels importés du Portugal",
      price: "2,50€",
    },
  ];

  const cocktails = [
    {
      name: "Caipirinha",
      description: "Cocktail brésilien traditionnel à la cachaça et citron vert",
      price: "6€",
    },
    {
      name: "Caipirão",
      description: "Caipirinha au rhum, citron vert et sucre de canne",
      price: "6€",
    },
  ];

  return (
    <div className="container max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">Notre Menu</h1>
        <p className="text-lg text-muted-foreground">
          Découvrez notre sélection de plats préparés avec des ingrédients frais et de saison
        </p>
      </div>

      {/* Starters */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <UtensilsCrossed className="h-6 w-6 text-restaurant-burgundy" />
          <h2 className="font-serif text-3xl font-bold">Entrées</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {starters.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{item.name}</CardTitle>
                  <span className="text-lg font-semibold text-restaurant-burgundy">
                    {item.price}
                  </span>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Main Courses */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <UtensilsCrossed className="h-6 w-6 text-restaurant-burgundy" />
          <h2 className="font-serif text-3xl font-bold">Plats Principaux</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {mains.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{item.name}</CardTitle>
                    {item.badge && (
                      <Badge variant="secondary" className="bg-restaurant-burgundy/10 text-restaurant-burgundy">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="text-lg font-semibold text-restaurant-burgundy">
                    {item.price}
                  </span>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Drinks */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <Wine className="h-6 w-6 text-restaurant-burgundy" />
          <h2 className="font-serif text-3xl font-bold">Boissons</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {drinks.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{item.name}</CardTitle>
                    {item.badge && (
                      <Badge variant="secondary" className="bg-restaurant-burgundy/10 text-restaurant-burgundy">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <span className="text-lg font-semibold text-restaurant-burgundy">
                    {item.price}
                  </span>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Cocktails */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <Coffee className="h-6 w-6 text-restaurant-burgundy" />
          <h2 className="font-serif text-3xl font-bold">Cocktails</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {cocktails.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{item.name}</CardTitle>
                  <span className="text-lg font-semibold text-restaurant-burgundy">
                    {item.price}
                  </span>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Info */}
      <Card className="border-restaurant-burgundy/20 bg-restaurant-burgundy/5">
        <CardContent className="pt-6">
          <h3 className="mb-2 font-semibold">Informations Importantes</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Menu sujet à changement selon la disponibilité des ingrédients</li>
            <li>• Allergies et restrictions alimentaires: veuillez informer votre serveur</li>
            <li>• Menu enfant disponible sur demande</li>
            <li>• Tous nos plats sont préparés sur place avec des produits frais</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
