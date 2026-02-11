'use client';

import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { BlogPost } from '@/lib/types';

interface BlogPostViewProps {
  post: BlogPost;
}

export function BlogPostView({ post }: BlogPostViewProps) {
  return (
    <article className="w-full px-4 md:px-5 lg:px-12 py-6 md:py-8 lg:py-12 large:py-16">
      <div className="mx-auto max-w-4xl">
        <header className="mb-4 md:mb-8 lg:mb-12 large:mb-16">
          <h1 className="mb-3 md:mb-6 text-2xl md:text-4xl lg:text-5xl large:text-6xl font-bold leading-tight">{post.title}</h1>
          <div className="mb-3 md:mb-6 flex flex-wrap gap-1.5 md:gap-3">
            {post.category.map((cat) => (
              <Badge key={cat} variant="outline" className="text-xs md:text-base px-2 md:px-3 py-0.5 md:py-1">
                {cat}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm md:text-lg text-muted-foreground">
            <time dateTime={post.publishedAt.toISOString()}>
              Published {format(post.publishedAt, 'MMM d, yyyy')}
            </time>
          </div>
          <Separator className="mt-4 md:mt-6" />
        </header>

        <div
          className="prose prose-sm md:prose-xl dark:prose-invert max-w-none prose-headings:text-2xl md:prose-headings:text-4xl prose-p:text-sm md:prose-p:text-lg prose-p:leading-relaxed prose-a:text-primary prose-strong:font-semibold"
          dangerouslySetInnerHTML={{ __html: post.htmlContent }}
        />

        {post.tags && post.tags.length > 0 && (
          <footer className="mt-8 md:mt-12 border-t pt-6 md:pt-8">
            <div className="flex flex-wrap gap-1.5 md:gap-3 items-center">
              <span className="text-sm md:text-lg text-muted-foreground">Tags:</span>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs md:text-base px-2 md:px-3 py-0.5 md:py-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </footer>
        )}
      </div>
    </article>
  );
}

