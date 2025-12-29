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
    <article className="w-full px-12 py-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12">
          <h1 className="mb-6 text-5xl font-bold md:text-6xl leading-tight">{post.title}</h1>
          <div className="mb-6 flex flex-wrap gap-3">
            {post.category.map((cat) => (
              <Badge key={cat} variant="outline" className="text-base px-3 py-1">
                {cat}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 text-lg text-muted-foreground">
            <time dateTime={post.publishedAt.toISOString()}>
              Published {format(post.publishedAt, 'MMM d, yyyy')}
            </time>
          </div>
          <Separator className="mt-6" />
        </header>
        
        <div
          className="prose prose-xl dark:prose-invert max-w-none prose-headings:text-4xl prose-p:text-lg prose-p:leading-relaxed prose-a:text-primary prose-strong:font-semibold"
          dangerouslySetInnerHTML={{ __html: post.htmlContent }}
        />
        
        {post.tags && post.tags.length > 0 && (
          <footer className="mt-12 border-t pt-8">
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-lg text-muted-foreground">Tags:</span>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-base px-3 py-1">
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

