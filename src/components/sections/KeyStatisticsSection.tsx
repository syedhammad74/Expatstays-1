import { Briefcase, Home, Smile } from "lucide-react"; // Briefcase for Experience, Home for Properties, Smile for Happy Clients

const stats = [
  {
    icon: Home,
    value: "199+",
    label: "Exclusive Properties",
  },
  {
    icon: Briefcase,
    value: "10+",
    label: "Years of Experience",
  },
  {
    icon: Smile,
    value: "5000+",
    label: "Happy Guests",
  },
];

const KeyStatisticsSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-8 bg-card/80 rounded-2xl shadow-glass hover:shadow-neumorph transition-smooth backdrop-blur-md animate-fade-in"
            >
              <stat.icon className="h-14 w-14 text-accent mx-auto mb-5" />
              <div className="text-5xl font-extrabold bg-gradient-to-br from-primary via-accent to-foreground bg-clip-text text-transparent mb-3">
                {stat.value}
              </div>
              <p className="text-lg text-muted-foreground font-sans tracking-wide font-semibold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyStatisticsSection;
