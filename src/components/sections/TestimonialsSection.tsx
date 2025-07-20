import { Star, MapPin } from "lucide-react"; // Using Star for rating
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const testimonials = [
  {
    quote:
      "Expat Stays provided an absolutely breathtaking villa for our family vacation. The service was impeccable from start to finish. Highly recommended!",
    name: "Sarah L.",
    location: "New York, USA",
    avatar:
      "https://ui-avatars.com/api/?name=SL&size=100&background=235347&color=ffffff&bold=true",
    imageHint: "woman smiling portrait",
  },
  {
    quote:
      "The attention to detail and luxury amenities at our Expat Stays property were second to none. We felt like royalty throughout our stay.",
    name: "John B.",
    location: "London, UK",
    avatar:
      "https://ui-avatars.com/api/?name=JB&size=100&background=235347&color=ffffff&bold=true",
    imageHint: "man professional suit",
  },
  {
    quote:
      "Booking with Expat Stays was seamless, and their concierge service helped us plan the perfect itinerary. We can't wait to return!",
    name: "Aisha K.",
    location: "Riyadh, KSA",
    avatar:
      "https://ui-avatars.com/api/?name=AK&size=100&background=235347&color=ffffff&bold=true",
    imageHint: "woman traditional attire",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center bg-gradient-to-br from-primary via-foreground to-accent bg-clip-text text-transparent drop-shadow-lg mb-4 animate-fade-in">
          Words From Our Valued Guests
        </h2>
        <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in">
          Hear what our satisfied clients have to say about their exceptional
          experiences with Expat Stays.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group hover:shadow-neumorph transition-smooth rounded-2xl shadow-glass bg-card/80 backdrop-blur-md animate-fade-in"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="rounded-full object-cover border-4 border-background/80 shadow-glass backdrop-blur-md"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-primary font-bold">
                      {testimonial.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{testimonial.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="text-muted-foreground leading-relaxed italic">
                  "{testimonial.quote}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
