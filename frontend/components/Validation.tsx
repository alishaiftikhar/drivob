// ✅ Full Name (Max 50, only alphabets & spaces)
export const validateFullName = (name: string): string => {
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!name.trim()) return 'Full name is required.';
  if (!nameRegex.test(name)) return 'Full name must contain only letters.';
  if (name.length > 50) return 'Full name must be less than 50 characters.';
  return '';
};

// ✅ CNIC (Format: 12345-1234567-0)
export const validateCNIC = (cnic: string): string => {
  const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
  if (!cnic.trim()) return 'CNIC is required.';
  if (!cnicRegex.test(cnic)) return 'CNIC must be in the format 12345-1234567-0.';
  return '';
};

// ✅ Email (Must be valid Gmail or any domain)
export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return 'Email is required.';
  if (!emailRegex.test(email)) return 'Invalid email format.';
  return '';
};

// ✅ Age (18 - 100)
export const validateAge = (age: string): string => {
  const numAge = parseInt(age);
  if (!age.trim()) return 'Age is required.';
  if (isNaN(numAge)) return 'Age must be a number.';
  if (numAge < 18) return 'You must be at least 18 years old.';
  if (numAge > 100) return 'Age cannot be more than 100 years.';
  return '';
};

// ✅ Phone Number (Exactly 11 digits)
export const validatePhoneNumber = (phone: string): string => {
  const phoneRegex = /^[0-9]{11}$/;
  if (!phone.trim()) return 'Phone number is required.';
  if (!phoneRegex.test(phone)) return 'Phone number must be exactly 11 digits.';
  return '';
};

// ✅ City/Address (Alphanumeric & spaces, Max 70)
export const validateAddress = (address: string): string => {
  const addressRegex = /^[A-Za-z0-9\s]+$/;
  if (!address.trim()) return 'Address is required.';
  if (!addressRegex.test(address)) return 'Address must be alphanumeric.';
  if (address.length > 70) return 'Address must be less than 70 characters.';
  return '';
};

// ✅ Password (8-15 chars, upper, lower, number, special char, not only numbers)
export const validatePassword = (password: string, username?: string): string => {
  const trimmedPassword = password.trim();

  if (!trimmedPassword) return 'Password is required.';
  if (trimmedPassword.length < 8) return 'Password must be at least 8 characters long.';
  if (trimmedPassword.length > 15) return 'Password must be no more than 15 characters.';
  if (/^\d+$/.test(trimmedPassword)) return 'Password cannot be entirely numeric.';
  if (username && trimmedPassword.toLowerCase().includes(username.toLowerCase().split('@')[0])) {
    return 'Password is too similar to your username.';
  }
  if (!/(?=.*[a-z])/.test(trimmedPassword)) return 'Password must contain at least one lowercase letter.';
  if (!/(?=.*[A-Z])/.test(trimmedPassword)) return 'Password must contain at least one uppercase letter.';
  if (!/(?=.*\d)/.test(trimmedPassword)) return 'Password must contain at least one number.';
  if (!/(?=.*[!@#$%^&*])/.test(trimmedPassword)) return 'Password must contain at least one special character.';

  return '';
};

// ✅ Confirm Password
export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!confirmPassword.trim()) return 'Confirm password is required.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  return '';
};

// ✅ License Number (Required string)
export const validateLicenseNumber = (license: string): string => {
  if (!license.trim()) return 'License number is required.';
  return '';
};
