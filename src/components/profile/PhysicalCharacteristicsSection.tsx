
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormSectionProps } from '@/types/profile';

const bodyTypes = ['Slim', 'Athletic', 'Average', 'Curvy', 'Plus Size'];
const hairColors = ['Black', 'Brown', 'Blonde', 'Red', 'Other'];
const eyeColors = ['Brown', 'Blue', 'Green', 'Hazel', 'Other'];
const ethnicities = ['Asian', 'Black', 'Caucasian', 'Hispanic', 'Middle Eastern', 'Mixed', 'Other'];

const PhysicalCharacteristicsSection = ({ form }: FormSectionProps) => {
  return (
    <div className="glass-card p-6 rounded-lg space-y-6">
      <h2 className="text-xl font-semibold neon-text">Physical Characteristics</h2>

      <FormField
        control={form.control}
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                required
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="height"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Height</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., 5'8&quot;" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="bodyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select body type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bodyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ethnicity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ethnicity</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ethnicity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ethnicities.map((ethnicity) => (
                    <SelectItem key={ethnicity} value={ethnicity}>
                      {ethnicity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="hairColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hair Color</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hair color" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {hairColors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eyeColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Eye Color</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select eye color" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {eyeColors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="measurements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Measurements</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., 34-26-36" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PhysicalCharacteristicsSection;
