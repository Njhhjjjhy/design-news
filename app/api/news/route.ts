import { NextResponse } from 'next/server';
import { aggregateNews } from '@/lib/api/news-aggregator';

export const dynamic = 'force-dynamic';
export const revalidate = 7200; // Revalidate every 2 hours
export const maxDuration = 30; // Maximum 30 seconds for the route

export async function GET() {
  try {
    const startTime = Date.now();
    const news = await aggregateNews();
    const duration = Date.now() - startTime;
    
    // Log performance for debugging
    if (duration > 5000) {
      console.warn(`News aggregation took ${duration}ms`);
    }
    
    return NextResponse.json(news, {
      headers: {
        'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

