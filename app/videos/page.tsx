'use client';

import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import type { VideoItem } from '@/lib/types';

async function fetchVideos(): Promise<VideoItem[]> {
  const response = await fetch('/api/videos');
  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }
  return response.json();
}

function VideosPageContent() {
  const { data: videos = [], isLoading, error } = useQuery<VideoItem[]>({
    queryKey: ['videos'],
    queryFn: fetchVideos,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  if (error) {
    return (
      <div className="w-full px-12 py-12">
        <div className="py-20 text-center">
          <p className="text-xl text-muted-foreground">Failed to load videos. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-12 py-12">
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="aspect-video animate-pulse rounded-lg bg-muted" role="status" aria-label="Loading videos">
              <span className="sr-only">Loading...</span>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-xl text-muted-foreground mb-4">No videos available.</p>
          <p className="text-base text-muted-foreground">
            {process.env.NEXT_PUBLIC_SHOW_API_HELP !== 'false' && (
              <>
                Make sure you have configured your YouTube API key in <code className="px-2 py-1 bg-muted rounded text-sm">.env.local</code>
              </>
            )}
          </p>
        </div>
      ) : (
        <div
          className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          role="list"
          aria-label="Design videos"
        >
          {videos.map((video) => (
            <div key={video.id} role="listitem" className="flex flex-col">
              <motion.a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-video rounded-lg overflow-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mb-2"
                aria-label={`Watch video: ${video.title}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Image
                  src={video.thumbnailUrl}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-12 w-12 text-white" />
                </div>
              </motion.a>
              <h3 className="text-sm font-medium line-clamp-2 leading-tight">
                {video.title}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VideosPage() {
  return (
    <Suspense fallback={
      <div className="w-full px-12 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" role="status" aria-label="Loading videos">
              <span className="sr-only">Loading...</span>
            </div>
          ))}
        </div>
      </div>
    }>
      <VideosPageContent />
    </Suspense>
  );
}

