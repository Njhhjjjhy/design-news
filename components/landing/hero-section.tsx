'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="w-full px-12 space-y-8 py-24 flex items-center justify-center min-h-[calc(100vh-5rem)]">
      <div className="w-full flex flex-col items-center gap-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-6xl font-bold leading-tight tracking-tight md:text-7xl lg:text-8xl"
        >
          Stay Ahead in Design
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full text-xl text-muted-foreground sm:text-2xl md:text-3xl leading-relaxed"
        >
          A curated hub for design professionals. Aggregate industry news across UI, UX, accessibility, and more.
          Capture insights with integrated note-taking that transforms into blog posts.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-6 sm:flex-row"
        >
          <Button asChild size="lg" className="text-lg px-8 py-6 h-auto">
            <Link href="/latest">Explore Latest News</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
            <Link href="/notes">Start Taking Notes</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

