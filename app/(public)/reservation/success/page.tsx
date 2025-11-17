"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Home, Mail, Phone } from "lucide-react";

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservationNumber = searchParams.get('number');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!reservationNumber) {
      router.push('/reservation');
      return;
    }

    // Countdown to redirect to home
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [reservationNumber, router]);

  if (!reservationNumber) {
    return null;
  }

  return (
    <div className="container max-w-4xl px-4 py-12">
      {/* Success Icon */}
      <div className="mb-8 flex justify-center">
        <div className="rounded-full bg-green-100 p-4">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
      </div>

      {/* Main Success Card */}
      <Card className="mb-6 border-green-200">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-3xl text-green-700">
            Réservation Confirmée !
          </CardTitle>
          <CardDescription className="text-lg">
            Votre table a été réservée avec succès
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Reservation Number */}
          <div className="rounded-lg border-2 border-restaurant-burgundy/20 bg-restaurant-burgundy/5 p-6 text-center">
            <p className="mb-2 text-sm text-muted-foreground">Numéro de Réservation</p>
            <p className="font-mono text-2xl font-bold text-restaurant-burgundy">
              {reservationNumber}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Conservez ce numéro pour toute modification ou annulation
            </p>
          </div>

          {/* Confirmation Message */}
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Mail className="h-5 w-5" />
              <span>Un email de confirmation a été envoyé à votre adresse</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Phone className="h-5 w-5" />
              <span>Vous recevrez également une confirmation par SMS</span>
            </div>
          </div>

          {/* What's Next */}
          <div className="rounded-lg border p-6">
            <h3 className="mb-4 font-semibold">Prochaines Étapes</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Vérifiez votre email pour les détails complets de la réservation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Ajoutez la réservation à votre calendrier</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>Arrivez 10 minutes avant votre heure de réservation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>En cas de changement, contactez-nous au moins 24h à l'avance</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                <Home className="mr-2 h-5 w-5" />
                Retour à l'Accueil
              </Button>
            </Link>
            <Link href="/my-reservations" className="flex-1">
              <Button
                className="w-full bg-restaurant-burgundy hover:bg-restaurant-burgundy/90"
                size="lg"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Voir Mes Réservations
              </Button>
            </Link>
          </div>

          {/* Auto-redirect notice */}
          <p className="text-center text-sm text-muted-foreground">
            Redirection automatique dans {countdown} secondes...
          </p>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="border-restaurant-burgundy/20 bg-restaurant-burgundy/5">
        <CardContent className="pt-6">
          <h3 className="mb-3 font-semibold">Besoin d'Aide ?</h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-restaurant-burgundy" />
              <span>Téléphone: +33 1 23 45 67 89</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-restaurant-burgundy" />
              <span>Email: reservations@restaurantmarigel.com</span>
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Notre équipe est disponible du lundi au samedi, de 10h à 22h pour répondre à toutes vos questions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}
