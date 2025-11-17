import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Wine, Coffee } from "lucide-react";

export default function MenuPage() {
  const starters = [
    {
      name: "Foie Gras Poêlé",
      description: "Accompagné de chutney de figues et pain brioché",
      price: "24€",
    },
    {
      name: "Tartare de Saumon",
      description: "Avocat, citron vert et câpres",
      price: "18€",
    },
    {
      name: "Soupe à l'Oignon Gratinée",
      description: "Traditionnelle, avec croûtons et fromage fondu",
      price: "12€",
    },
    {
      name: "Salade de Chèvre Chaud",
      description: "Mesclun, noix, miel et toast de fromage de chèvre",
      price: "14€",
    },
  ];

  const mains = [
    {
      name: "Magret de Canard",
      description: "Sauce aux fruits rouges, gratin dauphinois et légumes de saison",
      price: "32€",
      badge: "Spécialité",
    },
    {
      name: "Boeuf Bourguignon",
      description: "Mijoté au vin rouge, accompagné de pommes de terre",
      price: "28€",
    },
    {
      name: "Loup de Mer Grillé",
      description: "Risotto aux asperges et sauce beurre blanc",
      price: "34€",
    },
    {
      name: "Coq au Vin",
      description: "Recette traditionnelle, champignons et lardons",
      price: "26€",
    },
    {
      name: "Plat Végétarien",
      description: "Légumes grillés, quinoa et sauce tahini",
      price: "22€",
      badge: "Végétarien",
    },
  ];

  const desserts = [
    {
      name: "Crème Brûlée",
      description: "Vanille de Madagascar, caramélisée à la demande",
      price: "10€",
      badge: "Classique",
    },
    {
      name: "Tarte Tatin",
      description: "Servie tiède avec glace vanille",
      price: "12€",
    },
    {
      name: "Fondant au Chocolat",
      description: "Coeur coulant, glace pistache",
      price: "11€",
    },
    {
      name: "Profiteroles",
      description: "Glace vanille et sauce chocolat chaud",
      price: "11€",
    },
  ];

  const wines = [
    {
      name: "Château Margaux 2015",
      description: "Bordeaux, France",
      price: "120€",
    },
    {
      name: "Chablis Premier Cru",
      description: "Bourgogne, France",
      price: "65€",
    },
    {
      name: "Champagne Veuve Clicquot",
      description: "Reims, France",
      price: "95€",
    },
    {
      name: "Côtes du Rhône Villages",
      description: "Vallée du Rhône, France",
      price: "45€",
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

      {/* Desserts */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <Coffee className="h-6 w-6 text-restaurant-burgundy" />
          <h2 className="font-serif text-3xl font-bold">Desserts</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {desserts.map((item, index) => (
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

      {/* Wine List */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <Wine className="h-6 w-6 text-restaurant-burgundy" />
          <h2 className="font-serif text-3xl font-bold">Carte des Vins</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {wines.map((item, index) => (
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
