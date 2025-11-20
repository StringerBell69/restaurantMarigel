"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Calendar, Users, Book, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "À Propos", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="font-serif text-2xl font-bold text-restaurant-burgundy">
            SABORES DE PORTUGAL
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-restaurant-burgundy"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/my-reservations">
            <Button variant="outline" size="sm">
              <Users className="mr-2 h-4 w-4" />
              Mes Réservations
            </Button>
          </Link>
          <Link href="/reservation">
            <Button size="sm" className="bg-restaurant-burgundy hover:bg-restaurant-burgundy/90">
              <Calendar className="mr-2 h-4 w-4" />
              Réserver une Table
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 space-y-2">
              <Link href="/my-reservations" className="block">
                <Button variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Users className="mr-2 h-4 w-4" />
                  Mes Réservations
                </Button>
              </Link>
              <Link href="/reservation" className="block">
                <Button className="w-full bg-restaurant-burgundy" onClick={() => setMobileMenuOpen(false)}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Réserver une Table
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
