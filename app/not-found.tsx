import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="w-full px-4 md:px-5 lg:px-12 py-10 md:py-16 lg:py-24 large:py-32 flex items-center justify-center min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-5rem)]">
      <div className="text-center">
        <h1 className="mb-3 md:mb-4 text-6xl md:text-8xl font-bold">404</h1>
        <p className="mb-6 md:mb-8 text-lg md:text-2xl text-muted-foreground">
          This page could not be found.
        </p>
        <Button asChild size="lg" className="text-sm md:text-lg px-6 md:px-8 py-4 md:py-6 h-auto">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
}

