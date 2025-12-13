import Image from 'next/image';
import BookingSearchWidget from '@/components/BookingSearchWidget';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative bg-background pt-24 pb-16 lg:pt-28 lg:pb-20 overflow-hidden">
      {/* Main Hero Content */}
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[70vh] lg:min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8 lg:space-y-10 animate-fade-in relative z-10">
            <div className="space-y-5 lg:space-y-7">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight bg-gradient-to-br from-primary via-foreground to-accent bg-clip-text text-transparent drop-shadow-lg">
                Find A House<br />
                <span className="block text-primary animate-slide-up mt-2">That Suits You</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Want to find a home? We are ready to help you find one that suits your lifestyle and needs
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-xl px-8 py-6 lg:px-10 lg:py-4 text-base lg:text-lg font-semibold bg-primary text-primary-foreground shadow-glass hover:bg-primary/90 hover:shadow-neumorph transition-smooth border-2 border-primary animate-fade-in"
              >
                <a
                  href="https://wa.me/923155610110?text=Hello%20Isa%20Hussain!%20I'm%20interested%20in%20learning%20more%20about%20Expat%20Stays."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Us
                </a>
              </Button>
            </div>
            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6 lg:gap-10 pt-6 lg:pt-10 border-t border-border/50">
              <div className="text-center lg:text-left">
                <div className="text-3xl lg:text-5xl font-bold text-foreground mb-1">
                  1200<span className="text-primary">+</span>
                </div>
                <div className="text-sm lg:text-base text-muted-foreground">Listed Properties</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl lg:text-5xl font-bold text-foreground mb-1">
                  4500<span className="text-primary">+</span>
                </div>
                <div className="text-sm lg:text-base text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl lg:text-5xl font-bold text-foreground mb-1">
                  100<span className="text-primary">+</span>
                </div>
                <div className="text-sm lg:text-base text-muted-foreground">Awards</div>
              </div>
            </div>
          </div>
          {/* Right Content - Building Image */}
          <div className="relative h-[400px] sm:h-[500px] lg:h-[650px] animate-fade-in mt-10 lg:mt-0">
            <Image
              src="/media/DSC01806 HDR June 25 2025/DSC01817-HDR.jpg"
              alt="Modern Luxury Building"
              fill
              className="object-cover rounded-2xl shadow-glass border-4 border-background/80"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
        {/* Search Widget Card */}
        <div className="mt-16 lg:mt-20 relative animate-fade-in z-20">
          <div className="bg-card/80 border border-border rounded-2xl p-6 sm:p-10 shadow-glass backdrop-blur-md max-w-5xl mx-auto -mb-20 lg:-mb-24">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-5 sm:mb-7 text-center">
              Search for available properties
            </h2>
            <BookingSearchWidget />
          </div>
        </div>
      </div>
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full opacity-[0.03] pointer-events-none">
        <Image
          src="/media/DSC01806 HDR June 25 2025/DSC01822-HDR.jpg"
          alt="Background Pattern"
          fill
          className="object-cover"
        />
      </div>
    </section>
  );
};

export default HeroSection;
