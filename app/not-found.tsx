import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="w-full px-12 py-24 flex items-center justify-center min-h-[calc(100vh-5rem)]">
      <div className="text-center">
        <h1 className="mb-4 text-8xl font-bold">404</h1>
        <p className="mb-8 text-2xl text-muted-foreground">
          This page could not be found.
        </p>
        <Button asChild size="lg" className="text-lg px-8 py-6 h-auto">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
}

