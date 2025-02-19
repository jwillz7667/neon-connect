import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ContactPage = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We'll get back to you as soon as possible.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        
        <div className="mb-8">
          <p className="text-lg mb-4">
            Have a question or concern? We're here to help. Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
            <Input id="name" placeholder="Your name" required />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
            <Input id="email" type="email" placeholder="your@email.com" required />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
            <Input id="subject" placeholder="What is this regarding?" required />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
            <Textarea
              id="message"
              placeholder="Please describe your issue or question"
              className="min-h-[150px]"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Other Ways to Reach Us</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Email</h3>
              <p>support@neonmeet.com</p>
            </div>
            <div>
              <h3 className="font-medium">Business Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM PST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
