

export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return 'Email is required.';
  if (!emailRegex.test(email)) return 'Invalid email format.';
  return '';
};

export const validateFullName = (name: string): string => {
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!name.trim()) return 'Full name is required.';
  if (!nameRegex.test(name)) return 'Only letters are allowed in full name.';
  return '';
};

export const validatePassword = (password: string): string => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!password) return 'Password is required.';
  if (!passwordRegex.test(password))
    return 'Password must be at least 6 characters and include letters, digits, and symbols.';
  return '';
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!confirmPassword) return 'Confirm your password.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  return '';
};

export const validateAge = (age: string): string => {
  const numAge = parseInt(age);
  if (!age.trim()) return 'Age is required.';
  if (isNaN(numAge) || numAge < 18) return 'Age must be a number and at least 18.';
  return '';
};

export const validateLicense = (license: string): string => {
  if (!license.trim()) return 'License number is required.';
  if (license.length < 5) return 'License number is too short.';
  return '';
};

export const validatePhoneNumber = (phone: string): string => {
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phone.trim()) return 'Phone number is required.';
  if (!phoneRegex.test(phone)) return 'Invalid phone number.';
  return '';
};

export const validateAddress = (address: string): string => {
  if (!address.trim()) return 'Address is required.';
  return '';
};
