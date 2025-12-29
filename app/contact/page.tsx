'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function ContactPage() {
  return (
    <div className="w-full px-12 py-24 flex items-center justify-center min-h-[calc(100vh-5rem)]">
      <div className="w-full max-w-2xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold md:text-6xl">Get in Touch</h1>
          <p className="text-xl text-muted-foreground md:text-2xl">
            Have a question or want to collaborate? Let's talk.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Send a Message</CardTitle>
            <CardDescription className="text-lg">
              Fill out the form below and I'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">Name</Label>
              <Input id="name" placeholder="Your name" className="h-12 text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input id="email" type="email" placeholder="your.email@example.com" className="h-12 text-base" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-base">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell me about your project or question..."
                className="min-h-32 text-base"
              />
            </div>
            <Button size="lg" className="w-full text-lg px-8 py-6 h-auto">
              Send Message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

