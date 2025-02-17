
export interface ProfileFormData {
  username: string;
  fullName: string;
  bio: string;
  city: string;
  state: string;
  website: string;
  avatarUrl: string;
  avatarFile?: File;
  height: string;
  bodyType: string;
  age: number;
  ethnicity: string;
  hairColor: string;
  eyeColor: string;
  measurements: string;
  languages: string[];
  availability: string;
  services: string[];
  rates: {
    hourly?: number;
    daily?: number;
  };
  contactInfo: {
    email?: string;
    phone?: string;
    preferred?: string;
  };
}

export interface FormSectionProps {
  form: any; // We'll use any here since the form type is complex
  isLoading?: boolean;
}
