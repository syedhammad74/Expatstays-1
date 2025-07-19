import Image from 'next/image';
import BookingSearchWidget from '@/components/BookingSearchWidget';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative bg-background pt-28 pb-20 overflow-hidden">
      {/* Main Hero Content */}
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-10 animate-fade-in">
            <div className="space-y-7">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight bg-gradient-to-br from-primary via-foreground to-accent bg-clip-text text-transparent drop-shadow-lg">
                Find A House<br />
                <span className="block text-primary animate-slide-up">That Suits You</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                Want to find a home? We are ready to help you find one that suits your lifestyle and needs
              </p>
              <Button 
                size="lg"
                className="rounded-xl px-10 py-4 text-lg font-semibold bg-primary text-primary-foreground shadow-glass hover:bg-primary/90 hover:shadow-neumorph transition-smooth border-2 border-primary animate-fade-in"
              >
                Get Started
              </Button>
            </div>
            {/* Statistics */}
            <div className="grid grid-cols-3 gap-10 pt-10">
              <div className="text-center lg:text-left">
                <div className="text-4xl lg:text-5xl font-bold text-foreground mb-1">
                  1200<span className="text-primary">+</span>
                </div>
                <div className="text-base text-muted-foreground">Listed Properties</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-4xl lg:text-5xl font-bold text-foreground mb-1">
                  4500<span className="text-primary">+</span>
                </div>
                <div className="text-base text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-4xl lg:text-5xl font-bold text-foreground mb-1">
                  100<span className="text-primary">+</span>
                </div>
                <div className="text-base text-muted-foreground">Awards</div>
              </div>
            </div>
          </div>
          {/* Right Content - Building Image */}
          <div className="relative h-[500px] lg:h-[650px] animate-fade-in">
            <Image
              src="/media/DSC01806 HDR June 25 2025/DSC01817-HDR.jpg"
              alt="Modern Luxury Building"
              fill
              className="object-cover rounded-2xl shadow-glass border-4 border-background/80"
              priority
            />
          </div>
        </div>
        {/* Search Widget Card */}
        <div className="mt-20 relative animate-fade-in">
          <div className="bg-card/80 border border-border rounded-2xl p-10 shadow-glass backdrop-blur-md max-w-3xl mx-auto -mb-24">
            <h2 className="text-2xl font-bold text-foreground mb-7 text-center">
              Search for available properties
            </h2>
            <BookingSearchWidget />
          </div>
        </div>
      </div>
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.04] parallax-bg"
           style={{
             backgroundImage: 'url(/media/DSC01806 HDR June 25 2025/DSC01822-HDR.jpg)'
           }}>
      </div>
    </section>
  );
};

export default HeroSection;
