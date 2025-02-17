
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormSectionProps } from '@/types/profile';

const ServicesSection = ({ form }: FormSectionProps) => {
  return (
    <div className="glass-card p-6 rounded-lg space-y-6">
      <h2 className="text-xl font-semibold neon-text">Services & Availability</h2>

      <FormField
        control={form.control}
        name="services"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Services (comma-separated)</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value?.join(', ') || ''}
                onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                placeholder="e.g., Service 1, Service 2, Service 3"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="languages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Languages (comma-separated)</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value?.join(', ') || ''}
                onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                placeholder="e.g., English, Spanish, French"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="availability"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Availability</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Describe your availability..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ServicesSection;
