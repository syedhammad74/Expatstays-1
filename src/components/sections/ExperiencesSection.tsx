import Link from "next/link";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { getLocalImage } from "@/lib/imageUtils";

const experiences = [
  {
    title: "Desert Safari Adventure",
    image: getLocalImage("desert", 2),
    imageHint: "desert safari dune",
    description:
      "Thrilling dune bashing, camel rides, and traditional Bedouin camp experiences.",
    slug: "desert-safari",
  },
  {
    title: "Luxury Yacht Cruises",
    image: getLocalImage("yacht", 2),
    imageHint: "luxury yacht sea",
    description:
      "Sail the stunning coastline with our exclusive private yacht charters.",
    slug: "yacht-cruises",
  },
  {
    title: "Gourmet Dining Experiences",
    image: getLocalImage("dining", 2),
    imageHint: "fine dining restaurant",
    description:
      "Indulge in world-class cuisine at Dubai's most renowned restaurants.",
    slug: "gourmet-dining",
  },
];

const ExperiencesSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center bg-gradient-to-br from-primary via-foreground to-accent bg-clip-text text-transparent drop-shadow-lg mb-4 animate-fade-in">
          Unforgettable Experiences
        </h2>
        <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in">
          Enhance your stay by exploring curated local attractions and unique
          activities arranged by Expat Stays.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in">
          {experiences.map((exp) => (
            <Card
              key={exp.title}
              className="group hover:shadow-neumorph transition-smooth rounded-2xl shadow-glass bg-card/80 backdrop-blur-md animate-fade-in"
            >
              <CardHeader className="pb-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-4">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-95"
                  />
                </div>
                <CardTitle className="text-primary font-bold text-xl">
                  {exp.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-xl bg-primary text-primary-foreground font-semibold shadow-glass hover:bg-primary/90 hover:shadow-neumorph transition-smooth"
                >
                  <Link href={`/experiences/${exp.slug}`}>Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center animate-fade-in">
          <Button
            asChild
            size="lg"
            className="rounded-xl bg-primary text-primary-foreground font-semibold shadow-glass hover:bg-primary/90 hover:shadow-neumorph transition-smooth px-6 py-3"
          >
            <Link href="/experiences">Discover All Experiences</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ExperiencesSection;
