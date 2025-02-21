import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/db-helpers';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Update'];
type UserRole = Database['public']['Enums']['user_role'];
type VerificationStatus = Database['public']['Enums']['verification_status'];

export default function ProviderOnboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Profile>({
    // Basic Information
    username: null,
    full_name: null,
    email: null,
    bio: null,
    avatar_url: null,
    website: null,
    
    // Location
    city: null,
    state: null,
    
    // Provider Status
    role: 'provider' as UserRole,
    verification_status: 'pending' as VerificationStatus,
    provider_since: new Date().toISOString(),
    
    // Physical Characteristics
    age: null,
    height: null,
    body_type: null,
    ethnicity: null,
    hair_color: null,
    eye_color: null,
    measurements: null,
    
    // Professional Information
    languages: [],
    availability: null,
    services: [],
    rates: {},
    contact_info: {},
    
    // Timestamps
    updated_at: new Date().toISOString()
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (name: keyof Profile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: Array.isArray(prev[name]) 
        ? [...(prev[name] as string[]), value]
        : [value]
    }));
  };

  const handleJsonChange = (name: keyof Profile, key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: {
        ...(prev[name] as Record<string, unknown>),
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        ...formData,
        id: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      setLoading(false);
      return;
    }

    // Create verification request
    const { error: verificationError } = await supabase
      .from('verification_requests')
      .insert({
        user_id: user.id,
        status: 'pending',
        submitted_at: new Date().toISOString()
      });

    if (verificationError) {
      console.error('Error creating verification request:', verificationError);
    }

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Provider Registration</h2>
          <p className="mt-2 text-sm text-gray-600">
            Step {step} of 4
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    required
                    value={formData.username || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    id="full_name"
                    required
                    value={formData.full_name || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    id="bio"
                    required
                    value={formData.bio || ''}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Physical Characteristics</h3>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="number"
                    name="age"
                    id="age"
                    min="18"
                    required
                    value={formData.age || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height</label>
                  <input
                    type="text"
                    name="height"
                    id="height"
                    required
                    value={formData.height || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="body_type" className="block text-sm font-medium text-gray-700">Body Type</label>
                  <input
                    type="text"
                    name="body_type"
                    id="body_type"
                    required
                    value={formData.body_type || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="ethnicity" className="block text-sm font-medium text-gray-700">Ethnicity</label>
                  <input
                    type="text"
                    name="ethnicity"
                    id="ethnicity"
                    required
                    value={formData.ethnicity || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="hair_color" className="block text-sm font-medium text-gray-700">Hair Color</label>
                  <input
                    type="text"
                    name="hair_color"
                    id="hair_color"
                    required
                    value={formData.hair_color || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="eye_color" className="block text-sm font-medium text-gray-700">Eye Color</label>
                  <input
                    type="text"
                    name="eye_color"
                    id="eye_color"
                    required
                    value={formData.eye_color || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="measurements" className="block text-sm font-medium text-gray-700">Measurements</label>
                  <input
                    type="text"
                    name="measurements"
                    id="measurements"
                    required
                    value={formData.measurements || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    required
                    value={formData.city || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    required
                    value={formData.state || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Availability</label>
                  <input
                    type="text"
                    name="availability"
                    id="availability"
                    required
                    value={formData.availability || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., Weekdays 9AM-5PM"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="languages" className="block text-sm font-medium text-gray-700">Languages</label>
                  <input
                    type="text"
                    id="languages"
                    placeholder="Add language and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        handleArrayChange('languages', input.value);
                        input.value = '';
                      }
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.languages?.map((lang, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="services" className="block text-sm font-medium text-gray-700">Services</label>
                  <input
                    type="text"
                    id="services"
                    placeholder="Add service and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        handleArrayChange('services', input.value);
                        input.value = '';
                      }
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.services?.map((service, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Contact & Rates</h3>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    name="website"
                    id="website"
                    value={formData.website || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">Contact Information</label>
                  <div className="mt-2 space-y-4">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="Type (e.g., phone, email)"
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            const valueInput = document.getElementById('contact-value') as HTMLInputElement;
                            handleJsonChange('contact_info', input.value, valueInput.value);
                            input.value = '';
                            valueInput.value = '';
                          }
                        }}
                      />
                      <input
                        id="contact-value"
                        type="text"
                        placeholder="Value"
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="mt-2">
                      {Object.entries(formData.contact_info || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">{key}:</span>
                          <span>{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">Rates</label>
                  <div className="mt-2 space-y-4">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="Service"
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            const valueInput = document.getElementById('rate-value') as HTMLInputElement;
                            handleJsonChange('rates', input.value, valueInput.value);
                            input.value = '';
                            valueInput.value = '';
                          }
                        }}
                      />
                      <input
                        id="rate-value"
                        type="text"
                        placeholder="Rate"
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="mt-2">
                      {Object.entries(formData.rates || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">{key}:</span>
                          <span>{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-5">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(prev => Math.max(1, prev - 1))}
                disabled={step === 1}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Previous
              </button>
              
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(prev => Math.min(4, prev + 1))}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
