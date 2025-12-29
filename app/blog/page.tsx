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
    <div className="w-full px-12 py-12">
      <div className="mb-12">
        <h1 className="mb-4 text-5xl font-bold md:text-6xl">Blog Posts</h1>
        <p className="text-xl text-muted-foreground md:text-2xl">
          Published articles from your notes.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="py-32 text-center flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-xl text-muted-foreground mb-8">No blog posts yet. Publish a note to get started!</p>
          <Button asChild className="mt-4 text-lg px-8 py-6 h-auto">
            <Link href="/notes">Go to Notes</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-4 flex flex-wrap gap-3">
                  {post.category.map((cat) => (
                    <Badge key={cat} variant="outline" className="text-base px-3 py-1">
                      {cat}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="line-clamp-2 text-xl mb-2">{post.title}</CardTitle>
                <CardDescription className="text-base">
                  {format(post.publishedAt, 'MMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {post.excerpt && (
                  <p className="mb-6 text-base text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                <Button asChild variant="outline" size="sm" className="text-base">
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

