import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Disclosure } from "@headlessui/react";
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Dynamic carousel to avoid SSR issues
const Carousel = dynamic(() => import("@/components/ui/carousel"), {
  ssr: false,
});

const carouselSlides = [
  {
    src: "/media/DSC01822-HDR.jpg",
    alt: "Concierge Excellence",
    title: "Concierge Excellence",
    button: "Discover Concierge",
  },
  {
    src: "/media/DSC01846-HDR.jpg",
    alt: "Laundry Service",
    title: "Impeccable Laundry",
    button: "See Laundry",
  },
  {
    src: "/media/DSC01871-HDR.jpg",
    alt: "Tech Support",
    title: "Technical Support",
    button: "Explore Tech",
  },
];

const services = [
  {
    icon: ConciergeBell,
    title: "365 Luxury Concierge",
    description:
      "Personalized, 24/7 assistance for reservations, recommendations & more.",
    href: "/services/concierge",
  },
  {
    icon: Shirt,
    title: "365 Laundry & Dry Cleaning",
    description: "Expert care, premium detergents & express delivery.",
    href: "/services/laundry",
  },
  {
    icon: Wrench,
    title: "365 Technical Services",
    description: "On-demand tech and smart-home support for flawless comfort.",
    href: "/services/technical",
  },
  {
    icon: Utensils,
    title: "Private Chef Services",
    description: "Gourmet in-home dining experiences curated to your palate.",
    href: "/services/chef",
  },
  {
    icon: Car,
    title: "Luxury Transportation",
    description: "Chauffeured rides in premium vehicles, anywhere, anytime.",
    href: "/services/transport",
  },
  {
    icon: Plane,
    title: "Travel Planning & Arrangements",
    description:
      "Custom itineraries, exclusive experiences & seamless bookings.",
    href: "/services/travel",
  },
];

const whyChoose = [
  {
    icon: Shield,
    title: "Rigorous Quality",
    desc: "Every service is vetted, audited & guaranteed for excellence.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    desc: "Personal concierge available 24/7 for any request or need.",
  },
  {
    icon: Star,
    title: "Elite Experiences",
    desc: "Access to curated events, VIP access & unique local experiences.",
  },
];

const howItWorksSteps = [
  {
    step: "1. Reach out via our app or hotline",
    note: "Available on iOS, Android, WhatsApp & direct dial.",
  },
  { step: "2. Tell us your preferences & requirements" },
  {
    step: "3. Sit back while we coordinate every detail",
    note: "From bookings to special requests, we handle it all.",
  },
  { step: "4. Enjoy unparalleled, personalized luxury service" },
];

// FAQs
const faqs = [
  {
    question: "How quickly can I request a service?",
    answer:
      "Our concierge is available 24/7; most requests are fulfilled within 2 hours, depending on complexity.",
  },
  {
    question: "Is there a minimum spend?",
    answer:
      "No minimum spend. You pay per service, with transparent pricing and no hidden fees.",
  },
  {
    question: "Can I customize my chef menu?",
    answer:
      "Absolutely! Our chefs work with you to design a menu tailored to your dietary preferences and tastes.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We operate in major metropolitan areas worldwide. Contact us to confirm availability in your location.",
  },
];

// FAQ Item Component
const ServicesOverviewSection: React.FC = () => (
  <section
    id="services-overview"
    className="relative w-full bg-gradient-to-b from-white to-[#F3F9F4] py-20 overflow-visible"
  >
    {/* Floating shapes */}
    <div className="absolute -top-20 -left-10 w-96 h-96 bg-[#8EB69B]/20 rounded-full filter blur-3xl rotate-45" />
    <div className="absolute -bottom-32 -right-10 w-[30rem] h-[30rem] bg-[#DAF1DE]/30 rounded-full filter blur-4xl rotate-12" />

    {/* Hero */}
    <div className="w-full flex flex-col lg:flex-row items-center justify-evenly px-4 py-12">
      <div className="flex-1 space-y-4 text-center lg:text-left lg:px-8">
        <span className="inline-block bg-gradient-to-r from-[#8EB69B] to-[#DAF1DE] text-white font-semibold px-4 py-1 rounded-full uppercase text-sm tracking-wide">
          Premium Services
        </span>
        <h1 className="text-4xl lg:text-5xl font-bold text-[#051F20] leading-snug">
          Elevate Your <span className="text-[#8EB69B]">Lifestyle</span>
        </h1>
        <p className="text-base lg:text-lg text-[#235347]">
          Experience top-tier luxury with our curated offerings built for
          discerning tastes.
        </p>
        <Link href="/services">
          <Button
            size="lg"
            className="mt-2 bg-[#8EB69B] hover:bg-[#72a785] text-white rounded-full px-6 py-2 shadow-md transition"
          >
            Explore All Services
            <ArrowRight className="ml-1 w-4 h-4" aria-hidden />
          </Button>
        </Link>
      </div>
      <div className="flex-1 mt-8 lg:mt-0 rounded-2xl overflow-hidden shadow-lg border border-[#E2F1E8] hover:scale-105 transition-transform">
        <Carousel slides={carouselSlides} />
      </div>
    </div>

    {/* Services Grid */}
    <div className="w-full px-4 py-12">
      <h2 className="text-3xl lg:text-4xl font-bold text-[#051F20] text-center mb-8">
        Our <span className="text-[#8EB69B]">Services</span>
      </h2>
      <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
        {services.map((svc, idx) => (
          <li key={idx} className="flex">
            <Card className="group relative w-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-transform border hover:border-[#8EB69B]/20">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-[#8EB69B] to-[#DAF1DE] p-3 rounded-full text-white shadow-md">
                <svc.icon className="w-6 h-6" aria-hidden />
              </div>
              <CardHeader className="mt-8 text-center">
                <CardTitle className="text-xl font-medium text-[#051F20]">
                  {svc.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center mt-2">
                <p className="text-[#235347] text-sm leading-relaxed mb-4">
                  {svc.description}
                </p>
                <Link href={svc.href}>
                  <Button
                    variant="outline"
                    className="rounded-full border border-[#8EB69B] text-[#8EB69B] hover:bg-[#8EB69B] hover:text-white px-4 py-1 text-sm transition"
                  >
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>

    {/* Why Choose */}
    <div className="w-full px-4 py-12 bg-white">
      <h2 className="text-3xl lg:text-4xl font-bold text-[#051F20] text-center mb-8">
        Why <span className="text-[#8EB69B]">Choose</span> Us?
      </h2>
      <ul className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
        {whyChoose.map((item, idx) => (
          <li key={idx} className="text-center flex flex-col items-center p-4">
            <div className="bg-white p-4 rounded-full shadow-md border border-[#8EB69B]/30">
              <item.icon className="w-6 h-6 text-[#8EB69B]" aria-hidden />
            </div>
            <h3 className="mt-3 text-lg font-semibold text-[#051F20]">
              {item.title}
            </h3>
            <p className="mt-1 text-[#235347] text-sm leading-relaxed">
              {item.desc}
            </p>
          </li>
        ))}
      </ul>
    </div>

    {/* How It Works Spotlight */}
    <div className="w-full px-4 py-12">
      <h2 className="text-3xl lg:text-4xl font-bold text-[#051F20] text-center mb-6">
        How It <span className="text-[#8EB69B]">Works</span>
      </h2>
      <CardSpotlight className="w-full bg-[#E2F1E8] rounded-2xl p-6 shadow-md border-t-4 border-[#8EB69B]">
        <ol className="list-decimal list-inside space-y-2 text-[#235347] leading-snug">
          {howItWorksSteps.map((item, idx) => (
            <li key={idx}>
              <span className="font-medium text-base text-[#051F20]">
                {item.step}
              </span>
              {item.note && (
                <div className="text-sm opacity-80 mt-1">{item.note}</div>
              )}
            </li>
          ))}
        </ol>
        <div className="mt-4 text-center">
          <Button
            size="sm"
            className="bg-[#8EB69B] text-white rounded-full px-4 py-1 hover:bg-[#72a785] transition"
          >
            Contact Concierge
          </Button>
        </div>
      </CardSpotlight>
    </div>

    {/* FAQ Section */}
    <div className="w-full px-4 py-12 bg-white">
      <h2 className="text-3xl lg:text-4xl font-bold text-[#051F20] text-center mb-6">
        FAQs
      </h2>
      <div className="space-y-2 px-2">
        {faqs.map((faq, idx) => (
          <Disclosure key={idx}>
            {({ open }) => (
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <Disclosure.Button className="w-full flex justify-between items-center px-4 py-2 bg-white hover:bg-gray-50 transition">
                  <span className="font-medium text-[#051F20] text-sm">
                    {faq.question}
                  </span>
                  {open ? (
                    <ChevronUp className="w-4 h-4 text-[#8EB69B]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 py-2 bg-[#F9FBFA] text-[#235347] text-sm leading-relaxed">
                  {faq.answer}
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesOverviewSection;
