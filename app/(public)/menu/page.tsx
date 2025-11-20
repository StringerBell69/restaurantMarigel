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

  const pichetVin = [
    {
      name: "Pichet de Vin Rouge",
      description: "Vin rouge portugais de la maison",
      price: "15€",
    },
    {
      name: "Pichet de Vin Vert",
      description: "Vinho Verde frais et léger",
      price: "15€",
    },
    {
      name: "Pichet de Rosé",
      description: "Rosé portugais rafraîchissant",
      price: "15€",
    },
  ];

  const bouteillesVin = [
    {
      name: "Ponte de Lima Vin Vert Rouge",
      description: "Vin vert rouge de la région de Ponte de Lima",
      price: "15€",
    },
    {
      name: "Esporão Alentejo Tinto Maduro",
      description: "Vin rouge de l'Alentejo, mûr et complexe",
      price: "15€",
    },
    {
      name: "Caiado Adega Mayor Tinto",
      description: "Vin rouge élégant de l'Alentejo",
      price: "15€",
    },
    {
      name: "Caiado Adega Mayor Branco",
      description: "Vin blanc frais de l'Alentejo",
      price: "15€",
    },
    {
      name: "Rosé Gatão",
      description: "Rosé portugais classique",
      price: "15€",
    },
    {
      name: "Rosé Mateus",
      description: "Le célèbre rosé portugais Mateus",
      price: "15€",
    },
  ];

  const bieres = [
    {
      name: "Super Bock",
      description: "Bière blonde portugaise emblématique",
      price: "2,50€",
    },
    {
      name: "1664",
      description: "Bière blonde française premium",
      price: "2,50€",
    },
    {
      name: "Desperados",
      description: "Bière aromatisée à la tequila",
      price: "2,50€",
    },
    {
      name: "Heineken",
      description: "Bière blonde internationale",
      price: "2,50€",
    },
  ];

  const boissons = [
    {
      name: "Coca-Cola",
      description: "Boisson pétillante classique",
      price: "2,50€",
    },
    {
      name: "Lipton Ice Tea",
      description: "Thé glacé rafraîchissant",
      price: "2,50€",
    },
    {
      name: "Fanta",
      description: "Soda à l'orange",
      price: "2,50€",
    },
    {
      name: "Sumol Laranja",
      description: "Soda portugais à l'orange",
      price: "2,50€",
    },
    {
      name: "Sumol Ananás",
      description: "Soda portugais à l'ananas",
      price: "2,50€",
    },
    {
      name: "Perrier",
      description: "Eau pétillante naturelle",
      price: "2,50€",
    },
    {
      name: "Pedras de Limão",
      description: "Eau gazeuse portugaise au citron",
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

      {/* Pichets de Vin */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <Wine className="h-6 w-6 text-restaurant-burgundy" />
          <h2 className="font-serif text-3xl font-bold">Pichets de Vin</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {pichetVin.map((item, index) => (
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

      {/* Bouteilles de Vin */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <Wine className="h-6 w-6 text-restaurant-burgundy" />
          <h2 className="font-serif text-3xl font-bold">Bouteilles de Vin</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {bouteillesVin.map((item, index) => (
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

      {/* Bières */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <Coffee className="h-6 w-6 text-restaurant-burgundy" />
          <h2 className="font-serif text-3xl font-bold">Bières</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {bieres.map((item, index) => (
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

      {/* Boissons Sans Alcool */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <Coffee className="h-6 w-6 text-restaurant-burgundy" />
          <h2 className="font-serif text-3xl font-bold">Boissons Sans Alcool</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {boissons.map((item, index) => (
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
