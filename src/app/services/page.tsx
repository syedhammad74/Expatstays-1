import Header from "@/components/layout/Header";
import ServicesOverviewSection from "@/components/sections/ServicesOverviewSection";

export default function ServicesPage() {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20 md:pt-28">
        <ServicesOverviewSection />
      </div>
    </>
  );
}
