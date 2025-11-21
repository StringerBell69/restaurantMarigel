/**
 * Structured Data (JSON-LD) for SEO
 * Provides rich snippets for Google and other search engines
 */
export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "SABORES DE PORTUGAL",
    "image": "https://saboresdeportugal.fr/og-image.jpg",
    "url": "https://saboresdeportugal.fr",
    "telephone": "+33753454916",
    "priceRange": "€€",
    "servesCuisine": ["Portuguese", "Portugaise"],
    "acceptsReservations": true,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "26b rue Joseph Longarini",
      "addressLocality": "Givors",
      "postalCode": "69700",
      "addressCountry": "FR",
      "addressRegion": "Auvergne-Rhône-Alpes"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 45.5867,
      "longitude": 4.7697
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Tuesday", "Thursday", "Friday", "Saturday"],
        "opens": "11:00",
        "closes": "22:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "12:00",
        "closes": "17:00"
      }
    ],
    "menu": "https://saboresdeportugal.fr/#menu",
    "areaServed": {
      "@type": "City",
      "name": "Givors"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    },
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://saboresdeportugal.fr/reservation",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "result": {
        "@type": "Reservation",
        "name": "Réservation de table"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
