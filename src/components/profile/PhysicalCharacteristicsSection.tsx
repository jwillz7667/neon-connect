import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface PhysicalCharacteristicsSectionProps {
  profile: Profile;
}

export function PhysicalCharacteristicsSection({ profile }: PhysicalCharacteristicsSectionProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Physical Characteristics</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal physical details</p>
      </div>

      <div className="border-t border-gray-200">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 p-6">
          {/* Height */}
          <div>
            <dt className="text-sm font-medium text-gray-500">Height</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.height || 'Not specified'}</dd>
          </div>

          {/* Body Type */}
          <div>
            <dt className="text-sm font-medium text-gray-500">Body Type</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.body_type || 'Not specified'}</dd>
          </div>

          {/* Age */}
          <div>
            <dt className="text-sm font-medium text-gray-500">Age</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.age || 'Not specified'}</dd>
          </div>

          {/* Ethnicity */}
          <div>
            <dt className="text-sm font-medium text-gray-500">Ethnicity</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.ethnicity || 'Not specified'}</dd>
          </div>

          {/* Hair Color */}
          <div>
            <dt className="text-sm font-medium text-gray-500">Hair Color</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.hair_color || 'Not specified'}</dd>
          </div>

          {/* Eye Color */}
          <div>
            <dt className="text-sm font-medium text-gray-500">Eye Color</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.eye_color || 'Not specified'}</dd>
          </div>

          {/* Measurements */}
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Measurements</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.measurements || 'Not specified'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default PhysicalCharacteristicsSection;
