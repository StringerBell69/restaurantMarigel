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
            Experience Fine Dining Excellence
          </h1>
          <p className="mb-8 text-lg text-white/90 md:text-xl">
            Discover exceptional cuisine crafted with passion and served with elegance.
            Reserve your table for an unforgettable dining experience.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/reservation">
              <Button
                size="lg"
                className="bg-white text-restaurant-burgundy hover:bg-white/90"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Reserve a Table
              </Button>
            </Link>
            <Link href="/menu">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                View Menu
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
              <h3 className="mb-2 text-xl font-semibold">Michelin Quality</h3>
              <p className="text-muted-foreground">
                Award-winning cuisine prepared by our expert culinary team
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-restaurant-burgundy/10 p-3">
                <Heart className="h-8 w-8 text-restaurant-burgundy" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Exceptional Service</h3>
              <p className="text-muted-foreground">
                Attentive staff dedicated to making your experience perfect
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 rounded-full bg-restaurant-burgundy/10 p-3">
                <Award className="h-8 w-8 text-restaurant-burgundy" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Elegant Ambiance</h3>
              <p className="text-muted-foreground">
                Beautiful setting perfect for any special occasion
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
              Why Choose Marigel?
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              We combine traditional culinary techniques with modern innovation
              to create memorable dining experiences
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border bg-background p-6">
                <Clock className="mb-3 h-8 w-8 text-restaurant-burgundy" />
                <h3 className="mb-2 font-semibold">Easy Reservations</h3>
                <p className="text-sm text-muted-foreground">
                  Book your table online in minutes with our advanced reservation system
                </p>
              </div>

              <div className="rounded-lg border bg-background p-6">
                <Users className="mb-3 h-8 w-8 text-restaurant-burgundy" />
                <h3 className="mb-2 font-semibold">Private Events</h3>
                <p className="text-sm text-muted-foreground">
                  Perfect for celebrations, business dinners, and special occasions
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
            Ready to Dine with Us?
          </h2>
          <p className="mb-8 text-lg text-white/90">
            Reserve your table now and experience culinary excellence
          </p>
          <Link href="/reservation">
            <Button
              size="lg"
              className="bg-white text-restaurant-burgundy hover:bg-white/90"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Your Table
            </Button>
          </Link>
        </div>
      </section>

      {/* Info Section */}
      <section className="border-t py-12">
        <div className="container px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <h3 className="mb-2 font-semibold">Location</h3>
              <p className="text-sm text-muted-foreground">
                123 Fine Dining Street<br />
                Downtown, City 12345
              </p>
            </div>

            <div className="text-center">
              <h3 className="mb-2 font-semibold">Hours</h3>
              <p className="text-sm text-muted-foreground">
                Lunch: 11:00 AM - 3:00 PM<br />
                Dinner: 6:00 PM - 11:00 PM
              </p>
            </div>

            <div className="text-center">
              <h3 className="mb-2 font-semibold">Contact</h3>
              <p className="text-sm text-muted-foreground">
                Phone: +1 (555) 123-4567<br />
                Email: info@restaurantmarigel.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
