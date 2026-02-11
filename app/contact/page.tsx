'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function ContactPage() {
  return (
    <div className="w-full px-4 md:px-5 lg:px-12 py-8 md:py-16 lg:py-24 large:py-32 flex items-center justify-center min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-5rem)]">
      <div className="w-full max-w-2xl">
        <div className="mb-4 md:mb-8 lg:mb-12 large:mb-16 text-center">
          <h1 className="mb-2 md:mb-4 text-2xl md:text-4xl lg:text-5xl large:text-6xl font-bold">Get in Touch</h1>
          <p className="text-sm md:text-xl lg:text-2xl text-muted-foreground">
            Have a question or want to collaborate? Let's talk.
          </p>
        </div>
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg md:text-2xl">Send a Message</CardTitle>
            <CardDescription className="text-sm md:text-lg">
              Fill out the form below and I'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6 p-4 pt-0 md:p-6 md:pt-0">
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="name" className="text-sm md:text-base">Name</Label>
              <Input id="name" placeholder="Your name" className="h-10 md:h-12 text-sm md:text-base" />
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="email" className="text-sm md:text-base">Email</Label>
              <Input id="email" type="email" placeholder="your.email@example.com" className="h-10 md:h-12 text-sm md:text-base" />
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="message" className="text-sm md:text-base">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell me about your project or question..."
                className="min-h-28 md:min-h-32 text-sm md:text-base"
              />
            </div>
            <Button size="lg" className="w-full text-sm md:text-lg px-6 md:px-8 py-4 md:py-6 h-auto">
              Send Message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

