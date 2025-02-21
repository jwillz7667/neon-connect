import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ServicesSectionProps {
  profile: Profile;
}

export function ServicesSection({ profile }: ServicesSectionProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Services & Availability</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Service offerings and scheduling information</p>
      </div>

      <div className="border-t border-gray-200">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 p-6">
          {/* Services */}
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Services Offered</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {profile.services && profile.services.length > 0 ? (
                <ul className="list-disc pl-4 space-y-1">
                  {profile.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
              ) : (
                'No services specified'
              )}
            </dd>
          </div>

          {/* Availability */}
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Availability</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
              {profile.availability || 'Not specified'}
            </dd>
          </div>

          {/* Contact Information */}
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Contact Information</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {profile.contact_info ? (
                <pre className="whitespace-pre-wrap font-sans">
                  {JSON.stringify(profile.contact_info, null, 2)}
                </pre>
              ) : (
                'Not specified'
              )}
            </dd>
          </div>

          {/* Rates */}
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Rates</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {profile.rates ? (
                <pre className="whitespace-pre-wrap font-sans">
                  {JSON.stringify(profile.rates, null, 2)}
                </pre>
              ) : (
                'Not specified'
              )}
            </dd>
          </div>

          {/* Website */}
          {profile.website && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Website</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <a 
                  href={profile.website}
                  className="text-indigo-600 hover:text-indigo-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.website}
                </a>
              </dd>
            </div>
          )}

          {/* Provider Status */}
          <div>
            <dt className="text-sm font-medium text-gray-500">Provider Since</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {profile.provider_since 
                ? new Date(profile.provider_since).toLocaleDateString()
                : 'Not specified'}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Verification Status</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.verification_status}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default ServicesSection;
