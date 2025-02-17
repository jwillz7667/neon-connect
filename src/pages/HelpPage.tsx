
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const HelpPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Help Center</h1>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I create an account?</AccordionTrigger>
            <AccordionContent>
              Click the "Sign Up" button in the top right corner. Fill out your basic information and verify your email address. Once verified, you can complete your profile.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>How do I become a verified provider?</AccordionTrigger>
            <AccordionContent>
              To become a verified provider, complete your profile and submit the required verification documents. Our team will review your application within 24-48 hours.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>What payment methods are accepted?</AccordionTrigger>
            <AccordionContent>
              We accept major credit cards, debit cards, and select digital payment methods. All payments are processed securely through our platform.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>How do I report an issue?</AccordionTrigger>
            <AccordionContent>
              You can report issues through the "Report" button on any profile or message, or contact our support team directly through the Contact page.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
          <p className="mb-4">
            If you couldn't find the answer you're looking for, please don't hesitate to reach out to our support team.
          </p>
          <button
            onClick={() => window.location.href = '/contact'}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
