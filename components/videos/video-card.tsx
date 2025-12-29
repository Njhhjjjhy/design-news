'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ExternalLink, Play } from 'lucide-react';
import type { VideoItem, Category } from '@/lib/types';
import { motion } from 'framer-motion';
import Image from 'next/image';

const categoryColors: Record<Category, string> = {
  UI: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  UX: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  AX: 'bg-green-500/10 text-green-500 border-green-500/20',
  VibeCoding: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  DesignSystems: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  Prototypes: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  ComponentLibraries: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  Interactions: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
};

interface VideoCardProps {
  video: VideoItem;
  viewMode?: 'grid' | 'list' | 'compact';
}

export function VideoCard({ video, viewMode = 'grid' }: VideoCardProps) {
  if (viewMode === 'compact') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          <div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base line-clamp-2 mb-2">{video.title}</CardTitle>
            <CardDescription className="text-sm">{video.channelName}</CardDescription>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="flex-shrink-0"
          >
            <a href={video.url} target="_blank" rel="noopener noreferrer" aria-label="Watch video">
              <ExternalLink className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </Card>
    );
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ x: 4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <div className="flex gap-6">
            <div className="relative w-64 h-36 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="h-12 w-12 text-white" />
              </div>
            </div>
            <div className="flex-1 p-6">
              <div className="mb-4 flex flex-wrap gap-3">
                {video.category.map((cat) => (
                  <motion.div
                    key={cat}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <Badge variant="outline" className={`${categoryColors[cat]} text-base px-3 py-1 cursor-pointer transition-all hover:shadow-sm`}>
                      {cat}
                    </Badge>
                  </motion.div>
                ))}
              </div>
              <CardTitle className="text-2xl mb-2 line-clamp-2">{video.title}</CardTitle>
              <CardDescription className="text-lg mb-4">{video.channelName}</CardDescription>
              <p className="mb-6 text-lg text-muted-foreground line-clamp-2 leading-relaxed">{video.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-base text-muted-foreground">
                  {format(video.publishDate, 'MMM d, yyyy')}
                  {video.viewCount && ` • ${formatViewCount(video.viewCount)} views`}
                </span>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline" size="sm" className="text-base group-hover:bg-accent transition-colors">
                    <a href={video.url} target="_blank" rel="noopener noreferrer">
                      Watch <ExternalLink className="ml-2 h-5 w-5 inline-block group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Grid view (default)
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card className="hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group" role="article" aria-label={video.title}>
        <div className="relative w-full aspect-video rounded-t-lg overflow-hidden">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="h-12 w-12 text-white" />
          </div>
        </div>
        <CardHeader>
          <div className="mb-4 flex flex-wrap gap-3">
            {video.category.map((cat) => (
              <motion.div
                key={cat}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Badge variant="outline" className={`${categoryColors[cat]} text-base px-3 py-1 cursor-pointer transition-all hover:shadow-sm`}>
                  {cat}
                </Badge>
              </motion.div>
            ))}
          </div>
          <CardTitle className="line-clamp-2 text-xl mb-2">{video.title}</CardTitle>
          <CardDescription className="text-base">{video.channelName}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <p className="mb-6 text-base text-muted-foreground line-clamp-2 flex-1 leading-relaxed">{video.description}</p>
          <div className="flex items-center justify-between text-base text-muted-foreground">
            <span>{format(video.publishDate, 'MMM d, yyyy')}</span>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild variant="ghost" size="sm" className="text-base group-hover:bg-accent transition-colors">
                <a href={video.url} target="_blank" rel="noopener noreferrer" aria-label={`Watch video: ${video.title}`}>
                  Watch <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <ExternalLink className="ml-1 h-4 w-4 inline-block group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </motion.span>
                </a>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

