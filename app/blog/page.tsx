'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/storage/blog-storage';
import type { BlogPost } from '@/lib/types';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setPosts(getAllBlogPosts().sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()));
  }, []);

  return (
    <div className="w-full px-4 md:px-5 lg:px-12 py-6 md:py-8 lg:py-12 large:py-16">
      <div className="mb-4 md:mb-8 lg:mb-12 large:mb-16">
        <h1 className="mb-2 md:mb-4 text-2xl md:text-4xl lg:text-5xl large:text-6xl font-bold">Blog Posts</h1>
        <p className="text-sm md:text-xl lg:text-2xl text-muted-foreground">
          Published articles from your notes.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="py-20 md:py-32 text-center flex flex-col items-center justify-center min-h-[50vh] md:min-h-[60vh]">
          <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8">No blog posts yet. Publish a note to get started!</p>
          <Button asChild className="mt-4 text-sm md:text-lg px-6 md:px-8 py-4 md:py-6 h-auto">
            <Link href="/notes">Go to Notes</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 md:gap-6 lg:gap-8 large:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 large:grid-cols-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-4 md:p-6">
                <div className="mb-2 md:mb-4 flex flex-wrap gap-1.5 md:gap-3">
                  {post.category.map((cat) => (
                    <Badge key={cat} variant="outline" className="text-xs md:text-base px-2 md:px-3 py-0.5 md:py-1">
                      {cat}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="line-clamp-2 text-base md:text-xl mb-1 md:mb-2">{post.title}</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  {format(post.publishedAt, 'MMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                {post.excerpt && (
                  <p className="mb-3 md:mb-6 text-sm md:text-base text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                <Button asChild variant="outline" size="sm" className="text-xs md:text-base">
                  <Link href={`/blog/${post.slug}`}>Read More</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

