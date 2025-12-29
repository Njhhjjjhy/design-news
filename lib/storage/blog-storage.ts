import type { BlogPost, Note } from '@/lib/types';
import { markdownToHtml, generateSlug, extractExcerpt } from '@/lib/utils/markdown-to-html';

const STORAGE_KEY = 'design-news-blog-posts';

export function getAllBlogPosts(): BlogPost[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const posts = JSON.parse(stored) as BlogPost[];
    // Convert date strings back to Date objects
    return posts.map((post) => ({
      ...post,
      createdAt: new Date(post.createdAt),
      publishedAt: new Date(post.publishedAt),
    }));
  } catch (error) {
    console.error('Error reading blog posts from localStorage:', error);
    return [];
  }
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const posts = getAllBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export function publishNoteAsBlogPost(note: Note): BlogPost {
  if (typeof window === 'undefined') {
    throw new Error('Cannot publish blog post on server');
  }
  
  const slug = generateSlug(note.title);
  const htmlContent = markdownToHtml(note.content.replace(/<[^>]*>/g, ''));
  const excerpt = extractExcerpt(htmlContent);
  
  const blogPost: BlogPost = {
    id: `blog-${note.id}`,
    slug,
    title: note.title,
    content: note.content.replace(/<[^>]*>/g, ''), // Store markdown
    htmlContent,
    category: note.category,
    createdAt: note.createdAt,
    publishedAt: new Date(),
    excerpt,
    tags: note.tags,
  };
  
  const posts = getAllBlogPosts();
  // Check if post with same slug exists
  const existingIndex = posts.findIndex((p) => p.slug === slug);
  
  if (existingIndex >= 0) {
    posts[existingIndex] = blogPost;
  } else {
    posts.push(blogPost);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  return blogPost;
}

export function deleteBlogPost(slug: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const posts = getAllBlogPosts();
    const filtered = posts.filter((post) => post.slug !== slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting blog post from localStorage:', error);
    throw error;
  }
}

