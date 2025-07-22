import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import {
  ConciergeBell,
  Shirt,
  Wrench,
  Utench,
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

const ServicesOverviewSection: React.FC = () => (
  <section
    id="services-overview"
    className="relative bg-gradient-to-b from-white to-[#F3F9F4] py-32 px-6 lg:px-24 overflow-hidden"
  >
    {/* Decorative shapes */}
    <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#8EB69B]/20 rounded-full filter blur-3xl rotate-45" />
    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#DAF1DE]/30 rounded-full filter blur-4xl rotate-12" />

    {/* Hero */}
    <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center mb-32">
      <div className="space-y-6 text-center lg:text-left">
        <span className="inline-block bg-gradient-to-r from-[#8EB69B] to-[#DAF1DE] text-white font-semibold px-5 py-2 rounded-full uppercase tracking-wider">
          Premium Services
        </span>
        <h1 className="text-5xl lg:text-6xl font-extrabold text-[#051F20] leading-tight">
          Elevate Your <br />
          <span className="text-[#8EB69B]">Lifestyle</span>
        </h1>
        <p className="text-lg text-[#235347] max-w-md mx-auto lg:mx-0">
          Experience the pinnacle of luxury with our handpicked suite of
          services tailored for discerning clients.
        </p>
        <Link href="/services">
          <Button
            size="lg"
            className="mt-4 bg-[#8EB69B] hover:bg-[#72a785] text-white rounded-full px-8 py-4 shadow-lg transition-all"
          >
            Explore All Services
            <ArrowRight className="ml-2 w-5 h-5" aria-hidden />
          </Button>
        </Link>
      </div>
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-[#E2F1E8] transform hover:scale-105 transition">
        <Carousel slides={carouselSlides} />
      </div>
    </div>

    {/* Services Grid */}
    <div className="relative z-10 max-w-6xl mx-auto mb-32">
      <h2 className="text-center text-3xl lg:text-4xl font-bold text-[#051F20] mb-12">
        Our <span className="text-[#8EB69B]">Services</span>
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((svc, idx) => (
          <li key={idx}>
            <Card className="group relative bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-transform border border-transparent hover:border-[#8EB69B]/20">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-[#8EB69B] to-[#DAF1DE] p-5 rounded-full text-white shadow-xl">
                <svc.icon className="w-8 h-8" aria-hidden />
              </div>
              <div className="mt-12 text-center">
                <CardTitle className="text-2xl font-semibold text-[#051F20] mb-4">
                  {svc.title}
                </CardTitle>
                <CardContent>
                  <p className="text-[#235347] text-base leading-relaxed mb-6">
                    {svc.description}
                  </p>
                </CardContent>
                <Link href={svc.href}>
                  <Button
                    variant="outline"
                    className="rounded-full border-2 border-[#8EB69B] text-[#8EB69B] hover:bg-[#8EB69B] hover:text-white transition px-8 py-3"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>

    {/* Why Choose */}
    <div className="relative z-10 max-w-4xl mx-auto mb-32">
      <h2 className="text-center text-3xl lg:text-4xl font-bold text-[#051F20] mb-8">
        Why <span className="text-[#8EB69B]">Choose</span> Us?
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {whyChoose.map((item, idx) => (
          <li key={idx} className="text-center">
            <div className="inline-block bg-white p-5 rounded-full shadow-xl border-2 border-[#8EB69B]/30">
              <item.icon className="w-8 h-8 text-[#8EB69B]" aria-hidden />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-[#051F20] mb-2">
              {item.title}
            </h3>
            <p className="mt-2 text-[#235347] text-sm leading-relaxed">
              {item.desc}
            </p>
          </li>
        ))}
      </ul>
    </div>

    {/* How It Works Spotlight */}
    <div className="relative z-10 max-w-3xl mx-auto mb-32">
      <h2 className="text-center text-3xl lg:text-4xl font-bold text-[#051F20] mb-6">
        How It <span className="text-[#8EB69B]">Works</span>
      </h2>
      <CardSpotlight className="bg-white rounded-3xl p-10 shadow-xl border-t-4 border-[#8EB69B]">
        <ol className="list-decimal list-inside space-y-4 text-[#235347] leading-relaxed">
          {howItWorksSteps.map((item, idx) => (
            <li key={idx}>
              <span className="font-medium text-base text-[#051F20]">
                {item.step}
              </span>
              {item.note && (
                <p className="text-sm opacity-80 mt-1">{item.note}</p>
              )}
            </li>
          ))}
        </ol>
        <div className="mt-8 text-center">
          <Button
            size="lg"
            className="bg-[#8EB69B] text-white rounded-full px-6 py-3 hover:bg-[#72a785] transition"
          >
            Contact Concierge
          </Button>
        </div>
      </CardSpotlight>
    </div>

    {/* FAQ Section */}
    <div className="relative z-10 max-w-3xl mx-auto mb-32">
      <h2 className="text-center text-3xl lg:text-4xl font-bold text-[#051F20] mb-8">
        Frequently Asked <span className="text-[#8EB69B]">Questions</span>
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <Disclosure key={idx}>
            {({ open }) => (
              <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <Disclosure.Button className="w-full flex justify-between items-center px-6 py-4 bg-white hover:bg-gray-50 transition">
                  <span className="text-left font-medium text-[#051F20]">
                    {faq.question}
                  </span>
                  {open ? (
                    <ChevronUp className="w-5 h-5 text-[#8EB69B]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </Disclosure.Button>
                <Disclosure.Panel className="px-6 py-4 bg-[#F9FBFA] text-[#235347] leading-relaxed">
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
