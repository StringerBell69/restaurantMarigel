import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-restaurant-burgundy">
              SABORES DE PORTUGAL
            </h3>
            <p className="text-sm text-muted-foreground">
              Découvrez une gastronomie d&apos;exception dans une atmosphère élégante.
              Nous créons des moments culinaires inoubliables.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Liens Rapides</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/menu" className="text-muted-foreground hover:text-foreground">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/reservation" className="text-muted-foreground hover:text-foreground">
                  Réservations
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                26b rue Joseph Longarini, 69700 Givors
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                0753454916
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                info@sumbo.fr
              </li>
            </ul>
          </div>

          {/* Hours & Social */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Horaires</h4>
            <div className="mb-4 space-y-1 text-sm text-muted-foreground">
              <p>Mar, Jeu, Ven, Sam: 11h00 - 22h00</p>
              <p>Dimanche: 12h00 - 17h00</p>
              <p className="mt-2 text-xs">Fermé lundi et mercredi</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-restaurant-burgundy">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-restaurant-burgundy">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-restaurant-burgundy">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} SABORES DE PORTUGAL. Tous droits réservés. Fait avec <span className="text-restaurant-burgundy">❤️</span> par <a href="https://smbsystem.me" target="_blank" rel="noopener noreferrer">Daniel</a></p>
        </div>
      </div>
    </footer>
  );
}
