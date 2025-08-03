// ✅ Full Name Validation
export const validateFullName = (name: string): string => {
  const nameRegex = /^[A-Za-z\s]{1,50}$/; // Only letters and spaces, max 50 characters
  if (!name.trim()) return 'Full name is required.';
  if (!nameRegex.test(name)) return 'Full name must contain only letters and spaces (max 50 characters).';
  return '';
};

// ✅ Password Validation
export const validatePassword = (password: string): string => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,15}$/;
  if (!password.trim()) return 'Password is required.';
  if (!passwordRegex.test(password)) {
    return 'Password must be 8–15 characters, include letters, numbers, and a special character.';
  }
  return '';
};

// ✅ Confirm Password
export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!confirmPassword.trim()) return 'Confirm password is required.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  return '';
};

// ✅ Age Validation
export const validateAge = (age: string): string => {
  const numAge = parseInt(age);
  if (!age.trim()) return 'Age is required.';
  if (isNaN(numAge)) return 'Age must be a number.';
  if (numAge < 18 || numAge > 100) return 'Age must be between 18 and 100.';
  return '';
};

// ✅ Phone Number (11-digit Pakistani format)
export const validatePhoneNumber = (phone: string): string => {
  const phoneRegex = /^[0-9]{11}$/;
  if (!phone.trim()) return 'Phone number is required.';
  if (!phoneRegex.test(phone)) return 'Phone number must be exactly 11 digits.';
  return '';
};

// ✅ CNIC (13-digit format: 1234512345671)
export const validateCNIC = (cnic: string): string => {
  const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/; // e.g., 12345-1234567-1
  if (!cnic.trim()) return 'CNIC is required.';
  if (!cnicRegex.test(cnic)) return 'CNIC must be in format 12345-1234567-1.';
  return '';
};

// ✅ Email (standard format)
// ✅ Improved High-Level Email Validation
export const validateEmail = (email: string): string => {
  const emailRegex = /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9])*@[a-zA-Z0-9]+(\.[a-zA-Z]{2,})+$/;

  if (!email.trim()) return 'Email is required.';

  // Check if it starts/ends with special character or has consecutive dots
  if (/^[._%+-]/.test(email) || /[._%+-]$/.test(email)) {
    return 'Email must not start or end with a special character.';
  }

  if (/\.\./.test(email)) {
    return 'Email must not contain consecutive dots.';
  }

  if (!emailRegex.test(email)) {
    return 'Enter a valid email address (e.g., example123@mail.com).';
  }

  return '';
};


// ✅ Address / City (at least 10 characters, alphanumeric + special)
export const validateAddress = (address: string): string => {
  const addressRegex = /^[a-zA-Z0-9\s.,#\-]{10,100}$/; // Letters, numbers, spaces and some special characters
  if (!address.trim()) return 'Address is required.';
  if (!addressRegex.test(address)) return 'Address must be 10–100 characters and can include special characters like .,#-';
  return '';
};

// ✅ License Number (exactly digits only, e.g., 7-10 digits)
export const validateLicenseNumber = (license: string): string => {
  const licenseRegex = /^[0-9]{7,10}$/;
  if (!license.trim()) return 'License number is required.';
  if (!licenseRegex.test(license)) return 'License number must be 7 to 10 digits.';
  return '';
};
