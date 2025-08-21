"use client";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import Logo from "../../../public/logo.png";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/properties", label: "Properties" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact Us" },
    { href: "/about", label: "About Expat Stays" },
  ];

  const socialIcons = [
    { href: "#", icon: Facebook, label: "Facebook" },
    { href: "#", icon: Twitter, label: "Twitter" },
    { href: "#", icon: Instagram, label: "Instagram" },
    { href: "#", icon: Linkedin, label: "LinkedIn" },
  ];

  const contactInfo = [
    { icon: MapPin, text: "123 Luxury Lane, Dubai, UAE" },
    { icon: Phone, text: "+971 (0)0 000 0000" },
    { icon: Mail, text: "contact@myexpatstays.com" },
  ];

  return (
    <footer className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl border-t border-white/20 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Image src={Logo} alt="Expat Stays" className="h-8 w-auto" />
              <span className="text-2xl font-bold">Expat Stays</span>
            </motion.div>
            <p className="mt-6 text-sm text-[#235347] leading-relaxed max-w-md">
              Experience unparalleled luxury and comfort with Expat Stays. Your
              premier choice for exclusive property rentals and management.
            </p>

            {/* Social Links */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-[#8EB69B] mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                {socialIcons.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-[#8EB69B]/10 rounded-full flex items-center justify-center text-[#8EB69B] hover:bg-[#8EB69B] hover:text-[#051F20] transition-all duration-200"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-[#163832] mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#235347] hover:text-[#8EB69B] transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-[#163832] mb-6">
              Contact Us
            </h3>
            <div className="space-y-4">
              {contactInfo.map((contact, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-[#8EB69B]/10 rounded-full flex items-center justify-center text-[#8EB69B] mt-0.5">
                    <contact.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    {contact.icon === Mail ? (
                      <a
                        href={`mailto:${contact.text}`}
                        className="text-sm text-[#235347] hover:text-[#8EB69B] transition-all duration-200"
                      >
                        {contact.text}
                      </a>
                    ) : contact.icon === Phone ? (
                      <a
                        href={`tel:${contact.text}`}
                        className="text-sm text-[#235347] hover:text-[#8EB69B] transition-all duration-200"
                      >
                        {contact.text}
                      </a>
                    ) : (
                      <p className="text-sm text-[#235347]">{contact.text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-[#DAF1DE]/50 to-[#8EB69B]/20 rounded-2xl p-8 mb-12 border border-[#8EB69B]/20">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-[#163832] mb-2">
              Stay Updated
            </h3>
            <p className="text-sm text-[#235347] mb-6">
              Subscribe to our newsletter for exclusive offers and updates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full bg-white/80 border border-[#8EB69B]/30 text-[#235347] placeholder:text-[#235347]/50 focus:outline-none focus:ring-2 focus:ring-[#8EB69B] backdrop-blur-sm"
              />
              <button className="px-6 py-3 bg-[#8EB69B] text-[#051F20] rounded-full font-semibold hover:bg-[#235347] hover:text-[#DAF1DE] transition-all duration-200 shadow-lg hover:shadow-[0_0_16px_#8EB69B55]">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#8EB69B]/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#235347]/60">
              &copy; {currentYear} Expat Stays. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-[#235347]/60 hover:text-[#8EB69B] transition-all duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-[#235347]/60 hover:text-[#8EB69B] transition-all duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-[#235347]/60 hover:text-[#8EB69B] transition-all duration-200"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
