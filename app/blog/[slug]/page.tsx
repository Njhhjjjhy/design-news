'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BlogPostView } from '@/components/blog/blog-post-view';
import { getBlogPostBySlug } from '@/lib/storage/blog-storage';
import type { BlogPost } from '@/lib/types';
import type { Metadata } from 'next';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const blogPost = getBlogPostBySlug(slug);
    if (blogPost) {
      setPost(blogPost);
    } else {
      setNotFound(true);
    }
  }, [slug]);

  if (notFound) {
    return (
      <div className="w-full px-4 md:px-5 lg:px-12 py-10 md:py-14 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-4xl font-bold">Post Not Found</h1>
          <p className="text-xl text-muted-foreground">
            The blog post you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full px-4 md:px-5 lg:px-12 py-10 md:py-14 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xl text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <BlogPostView post={post} />;
}

