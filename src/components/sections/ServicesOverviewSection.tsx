import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  ConciergeBell,
  Shirt,
  Wrench,
  Utensils,
  Car,
  Plane,
  Shield,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Carousel from "@/components/ui/carousel";
import { CardSpotlight } from "@/components/ui/card-spotlight";

const carouselSlides = [
  {
    title: "Concierge Excellence",
    button: "Discover Concierge",
    src: "/media/DSC01806 HDR June 25 2025/DSC01822-HDR.jpg",
  },
  {
    title: "Impeccable Laundry",
    button: "See Laundry Service",
    src: "/media/DSC01806 HDR June 25 2025/DSC01846-HDR.jpg",
  },
  {
    title: "Technical Support",
    button: "Explore Tech Help",
    src: "/media/DSC01806 HDR June 25 2025/DSC01871-HDR.jpg",
  },
];

const services = [
  {
    icon: ConciergeBell,
    title: "365 Luxury Concierge",
    description:
      "Personalized assistance for every need, from reservations to local recommendations.",
  },
  {
    icon: Shirt,
    title: "365 Laundry & Dry Cleaning",
    description:
      "Premium laundry and dry-cleaning, delivered with care and precision for your convenience.",
  },
  {
    icon: Wrench,
    title: "365 Technical Services",
    description:
      "Prompt, reliable support for all property amenities and smart home systems.",
  },
  {
    icon: Utensils,
    title: "Private Chef Services",
    description:
      "Exquisite in-home dining experiences, tailored to your tastes and dietary needs.",
  },
  {
    icon: Car,
    title: "Luxury Transportation",
    description:
      "Travel in style with our premium vehicles and professional chauffeurs.",
  },
  {
    icon: Plane,
    title: "Travel Planning & Arrangements",
    description:
      "Seamless itinerary planning, bookings, and exclusive experiences worldwide.",
  },
];

const whyChoose = [
  {
    icon: Shield,
    title: "Verified Quality",
    desc: "Every service and property is personally inspected and held to the highest standards.",
  },
  {
    icon: Users,
    title: "Personalized Support",
    desc: "Dedicated team available 24/7 for all your needs, from bookings to recommendations.",
  },
  {
    icon: Star,
    title: "Premium Experience",
    desc: "Curated amenities and experiences that go beyond standard luxury accommodations.",
  },
];

const howItWorksSteps = [
  "Contact your dedicated concierge via app or phone",
  "Share your preferences and requirements",
  "Relax while we handle bookings, recommendations, and arrangements",
  "Enjoy seamless, personalized service throughout your stay",
];

const ServicesOverviewSection = () => {
  return (
    <section className="relative py-12 lg:py-20 bg-gradient-to-br from-white to-[#F9FCFB] overflow-hidden">
      {/* Decorative blurred green blob for depth */}
      <div className="absolute -left-16 lg:-left-32 -top-16 lg:-top-32 w-[200px] lg:w-[420px] h-[200px] lg:h-[420px] bg-gradient-to-br from-[#DAF1DE]/20 to-[#8EB69B]/10 rounded-full blur-3xl z-0" />
      <div className="container mx-auto px-4 sm:px-8 relative z-10">
        {/* Hero Heading */}
        <div className="mb-8 lg:mb-10">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-[#051F20] mb-3 lg:mb-4 text-left">
            Our Bespoke Services
          </h2>
          <p className="text-base lg:text-lg text-[#4A4A4A] max-w-2xl text-left font-light">
            Experience a new standard of luxury living with our curated suite of
            services, designed for comfort, convenience, and unforgettable
            moments.
          </p>
        </div>
        {/* Carousel */}
        <div className="mb-10 lg:mb-14 rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl">
          <Carousel slides={carouselSlides} />
        </div>
        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-16 lg:mb-20">
          {services.map((service) => (
            <Card
              key={service.title}
              className="group rounded-xl lg:rounded-2xl shadow-lg border-none bg-white/90 hover:shadow-2xl transition-all duration-300 p-0"
            >
              <CardHeader className="pb-0 flex flex-col items-start bg-transparent">
                <div className="flex items-center justify-center w-12 lg:w-14 h-12 lg:h-14 rounded-full bg-gradient-to-br from-[#8EB69B]/20 to-[#DAF1DE]/40 mb-4 lg:mb-6 mt-4 lg:mt-6 ml-2">
                  <service.icon className="h-6 lg:h-7 w-6 lg:w-7 text-[#8EB69B]" />
                </div>
                <CardTitle className="text-[#051F20] font-bold text-lg lg:text-xl mb-2 ml-2">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-6 lg:pb-8 px-4 lg:px-6">
                <p className="text-sm lg:text-base text-[#4A4A4A] leading-relaxed font-medium">
                  {service.description}
                </p>
                <div className="mt-3 lg:mt-4">
                  <Button
                    variant="ghost"
                    className="text-[#8EB69B] px-0 py-0 h-8 hover:underline font-semibold text-sm lg:text-base"
                  >
                    Learn More{" "}
                    <ArrowRight className="inline ml-1 h-3 lg:h-4 w-3 lg:w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Why Choose Us Section */}
        <div className="mb-16 lg:mb-20">
          <h3 className="text-2xl lg:text-3xl font-bold text-[#051F20] mb-6 lg:mb-8 text-left">
            Why Choose Us
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {whyChoose.map((item) => (
              <Card
                key={item.title}
                className="rounded-xl lg:rounded-2xl bg-white/95 shadow-md border-none p-0"
              >
                <CardHeader className="flex flex-col items-start bg-transparent pb-0">
                  <div className="flex items-center justify-center w-10 lg:w-12 h-10 lg:h-12 rounded-lg lg:rounded-xl bg-gradient-to-br from-[#8EB69B]/20 to-[#DAF1DE]/40 mb-3 lg:mb-4 mt-4 lg:mt-6 ml-2">
                    <item.icon className="h-5 lg:h-6 w-5 lg:w-6 text-[#8EB69B]" />
                  </div>
                  <CardTitle className="text-[#051F20] font-bold text-base lg:text-lg mb-2 ml-2">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-6 lg:pb-8 px-4 lg:px-6">
                  <p className="text-sm lg:text-base text-[#4A4A4A] leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* CardSpotlight: How Our Concierge Works */}
        <div className="flex justify-center mb-10 lg:mb-12">
          <CardSpotlight className="w-full max-w-2xl bg-[#0B2B26] rounded-2xl lg:rounded-3xl shadow-2xl p-6 lg:p-8">
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 lg:mb-4 relative z-20">
              How Our Concierge Works
            </h3>
            <ol className="list-none space-y-3 lg:space-y-4 text-neutral-200 relative z-20 pl-0">
              {howItWorksSteps.map((step, idx) => (
                <li key={step} className="flex gap-2 lg:gap-3 items-start">
                  <CheckCircle className="h-4 lg:h-5 w-4 lg:w-5 text-[#8EB69B] mt-1 shrink-0" />
                  <span className="text-sm lg:text-base font-medium text-white">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
            <p className="text-neutral-300 mt-4 lg:mt-6 relative z-20 text-xs lg:text-sm">
              Our team is dedicated to making every moment effortless and
              extraordinary.
            </p>
          </CardSpotlight>
        </div>
        {/* CTA Button */}
        <div className="mt-2 text-left">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-[#0B2B26] text-white font-semibold shadow-lg hover:bg-[#235347] hover:shadow-xl transition-all duration-300 px-6 lg:px-8 py-3 lg:py-4 text-sm lg:text-base"
          >
            <Link href="/services">
              Explore All Services{" "}
              <ArrowRight className="inline ml-2 h-4 lg:h-5 w-4 lg:w-5" />
            </Link>
          </Button>
          <div className="text-[#8EB69B] text-sm lg:text-base font-medium mt-2 ml-2">
            Trusted by 1000+ guests
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverviewSection;
