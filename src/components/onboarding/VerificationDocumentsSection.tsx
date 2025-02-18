
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface VerificationDocumentsSectionProps {
  form: any;
  currentDate: string;
}

const VerificationDocumentsSection = ({ form, currentDate }: VerificationDocumentsSectionProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="idDocument"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Government-Issued ID</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => onChange(e.target.files?.[0] || null)}
                {...field}
                required
              />
            </FormControl>
            <FormDescription>
              Upload a clear photo of your government-issued ID
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="selfieWithId"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>Verification Selfie</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => onChange(e.target.files?.[0] || null)}
                {...field}
                required
              />
            </FormControl>
            <FormDescription>
              Upload a selfie of yourself holding:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Your government-issued ID (visible in the photo)</li>
                <li>A paper with today's date ({currentDate})</li>
                <li>Your username written on the paper</li>
                <li>The site name written on the paper</li>
              </ul>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default VerificationDocumentsSection;
