
export const validateAge = (dateOfBirth: string): boolean => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 18;
};

export const validateImageFile = (file: File): { isValid: boolean; error?: { title: string; description: string } } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: {
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or WebP image"
      }
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: {
        title: "File too large",
        description: "Image must be less than 10MB"
      }
    };
  }

  return { isValid: true };
};
