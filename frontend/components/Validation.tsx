// ✅ Full Name
export const validateFullName = (name: string): string => {
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!name.trim()) return 'Full name is required.';
  if (!nameRegex.test(name)) return 'Full name must contain only letters.';
  return '';
};

// ✅ Password
export const validatePassword = (password: string): string => {
  if (!password.trim()) return 'Password is required.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  return '';
};

// ✅ Confirm Password
export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!confirmPassword.trim()) return 'Confirm password is required.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  return '';
};

// ✅ Age
export const validateAge = (age: string): string => {
  const numAge = parseInt(age);
  if (!age.trim()) return 'Age is required.';
  if (isNaN(numAge)) return 'Age must be a number.';
  if (numAge < 18) return 'You must be at least 18 years old.';
  return '';
};

// ✅ Phone Number
export const validatePhoneNumber = (phone: string): string => {
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phone.trim()) return 'Phone number is required.';
  if (!phoneRegex.test(phone)) return 'Phone number must be 10 to 15 digits.';
  return '';
};

// ✅ CNIC (13-digit national ID)
export const validateCNIC = (cnic: string): string => {
  const cnicRegex = /^[0-9]{13}$/;
  if (!cnic.trim()) return 'CNIC is required.';
  if (!cnicRegex.test(cnic)) return 'CNIC must be exactly 13 digits.';
  return '';
};

// ✅ Email
export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return 'Email is required.';
  if (!emailRegex.test(email)) return 'Invalid email format.';
  return '';
};

// ✅ Address
export const validateAddress = (address: string): string => {
  if (!address.trim()) return 'Address is required.';
  return '';
};
