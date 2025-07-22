import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DecorativeElements } from "@/components/ui/decorative-elements";

export const metadata: Metadata = {
  title: "Expat Stays | Premium Long-Term Accommodations for Expatriates",
  description:
    "Find the perfect long-term rental for your expatriate journey. Luxury properties with full support services for international professionals.",
  keywords:
    "expat stays, expatriate housing, luxury rentals for expats, long-term expat accommodation, premium expat housing, international relocation housing",
  openGraph: {
    title: "Expat Stays | Premium Long-Term Accommodations for Expatriates",
    description:
      "Find the perfect long-term rental for your expatriate journey. Luxury properties with full support services for international professionals.",
    url: "https://myexpatstays.com/expat-stays",
    type: "website",
  },
};

export default function ExpatStaysPage() {
  return (
    <>
      <DecorativeElements variant="default" density="medium" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20 md:pt-28">
        <div className="max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Expat Stays: Premium Accommodations for International Professionals
          </h1>

          <p className="text-xl mb-8">
            Finding the perfect home away from home is essential for expatriates
            relocating internationally. Expat Stays specializes in curating
            luxury long-term accommodations tailored to the unique needs of
            global professionals.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg">Browse Properties</Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Why Choose Expat Stays for Your Relocation?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Curated Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Handpicked luxury properties in prime locations, vetted for
                  quality and comfort for expatriate professionals.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Relocation Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Comprehensive services to ease your transition, from airport
                  pickup to local orientation for expats new to the area.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flexible Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Accommodating lease terms designed specifically for expatriate
                  professionals with varying assignment durations.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8">
            Expat-Friendly Locations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="overflow-hidden">
              <div className="relative h-64 w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <h3 className="text-2xl font-bold">Dubai</h3>
                  <p>Luxury apartments for expatriate professionals</p>
                </div>
              </div>
              <CardContent>
                <p className="mb-4">
                  Dubai offers expatriates a cosmopolitan lifestyle with tax
                  benefits and world-class amenities.
                </p>
                <Link
                  href="/properties/dubai"
                  className="text-primary font-medium hover:underline"
                >
                  Explore Dubai properties
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-64 w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <h3 className="text-2xl font-bold">Singapore</h3>
                  <p>Modern condos for international executives</p>
                </div>
              </div>
              <CardContent>
                <p className="mb-4">
                  Singapore provides expatriates with safety, stability, and
                  access to all of Asia.
                </p>
                <Link
                  href="/properties/singapore"
                  className="text-primary font-medium hover:underline"
                >
                  Explore Singapore properties
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8">Expat Stays Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Personalized property matching for expatriate professionals
                  based on your specific needs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visa Assistance</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Support with visa applications and residency requirements for
                  expats relocating internationally.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Local Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Community introductions and cultural orientation for
                  expatriates new to the area.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ongoing Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  24/7 assistance for maintenance, emergencies, and any concerns
                  during your stay as an expat.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <Card className="bg-forest-primary/10">
            <CardContent className="p-8">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-semibold mb-4">
                  Ready to Find Your Expat Home?
                </h2>
                <p className="mb-6">
                  Join thousands of satisfied expatriate professionals who found
                  their perfect home away from home with Expat Stays.
                </p>
                <Button size="lg">Get Started</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
