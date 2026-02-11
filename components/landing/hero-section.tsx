'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="w-full px-4 md:px-5 lg:px-12 space-y-3 md:space-y-6 lg:space-y-8 large:space-y-10 py-10 md:py-16 lg:py-24 large:py-32 flex items-center justify-center min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-5rem)]">
      <div className="w-full flex flex-col items-center gap-5 md:gap-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold leading-tight tracking-tight md:text-5xl lg:text-7xl large:text-8xl"
        >
          Stay Ahead in Design
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full text-base text-muted-foreground md:text-xl lg:text-2xl large:text-3xl leading-relaxed"
        >
          A curated hub for design professionals. Aggregate industry news across UI, UX, accessibility, and more.
          Capture insights with integrated note-taking that transforms into blog posts.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-3 md:gap-6 md:flex-row w-full md:w-auto"
        >
          <Button asChild size="lg" className="text-sm md:text-lg px-6 md:px-8 py-4 md:py-6 h-auto">
            <Link href="/latest">Explore Latest News</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-sm md:text-lg px-6 md:px-8 py-4 md:py-6 h-auto">
            <Link href="/notes">Start Taking Notes</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

