import { Home } from 'lucide-react';
import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-smooth">
      <Home className="h-8 w-8" />
      <span className="text-2xl font-bold">La Maison</span>
    </Link>
  );
};

export default Logo;
