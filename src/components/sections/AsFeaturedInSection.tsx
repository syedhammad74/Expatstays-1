import Image from "next/image";

// Media outlets that have featured us
const mediaOutlets = [
  { name: "Forbes", src: null, imageHint: "Forbes logo" },
  { name: "Condé Nast Traveler", src: null, imageHint: "Conde Nast logo" },
  {
    name: "Luxury Travel Magazine",
    src: null,
    imageHint: "travel magazine logo",
  },
  {
    name: "Architectural Digest",
    src: null,
    imageHint: "Architectural Digest logo",
  },
  { name: "Elite Traveler", src: null, imageHint: "Elite Traveler logo" },
];

const AsFeaturedInSection = () => {
  return (
    <section className="py-12 bg-background/70 animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-12 h-0.5 bg-primary"></div>
          <h2 className="text-center text-muted-foreground text-xs font-semibold uppercase tracking-widest">
            As Featured In
          </h2>
          <div className="w-12 h-0.5 bg-primary"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center">
          {mediaOutlets.map((outlet) => (
            <div
              key={outlet.name}
              className="flex items-center justify-center h-14 w-full max-w-[140px] text-muted-foreground/70 hover:text-primary transition-colors duration-200 bg-card/80 rounded-xl shadow-glass backdrop-blur-md animate-fade-in"
            >
              <span className="text-base font-semibold text-center tracking-wide uppercase">
                {outlet.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AsFeaturedInSection;
