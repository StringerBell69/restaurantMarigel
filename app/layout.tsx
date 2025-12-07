import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { EventPopup } from "@/components/EventPopup";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif"
});

export const metadata: Metadata = {
  title: "SABORES DE PORTUGAL - Restaurant Portugais à Givors (Lyon) | Cuisine Authentique",
  description: "Restaurant portugais authentique à Givors près de Lyon. Savourez la vraie cuisine portugaise dans une ambiance chaleureuse. Réservation en ligne facile. 26b rue Joseph Longarini, 69700 Givors.",
  keywords: [
    "restaurant portugais",
    "restaurant portugais Lyon",
    "restaurant portugais Givors",
    "Sabores de Portugal",
    "cuisine portugaise",
    "restaurant Givors",
    "restaurant Lyon sud",
    "cuisine authentique portugaise",
    "spécialités portugaises",
    "réservation restaurant portugais"
  ],
  authors: [{ name: "SABORES DE PORTUGAL" }],
  creator: "SABORES DE PORTUGAL",
  publisher: "SABORES DE PORTUGAL",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "SABORES DE PORTUGAL - Restaurant Portugais à Givors",
    description: "Restaurant portugais authentique à Givors près de Lyon. Cuisine traditionnelle portugaise, ambiance chaleureuse. Réservez votre table en ligne.",
    url: "https://saboresdeportugal.fr",
    siteName: "SABORES DE PORTUGAL",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SABORES DE PORTUGAL - Restaurant Portugais Givors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SABORES DE PORTUGAL - Restaurant Portugais Givors",
    description: "Restaurant portugais authentique près de Lyon. Réservez votre table en ligne.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Ajoutez vos codes de vérification Google Search Console ici
    // google: 'votre-code-google',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://saboresdeportugal.fr',
  },
  category: 'restaurant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <EventPopup />
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
