// ---------------------------------------------
// Form validation — used by contact form, newsletter signup, checkout
// Returns { valid: boolean, message: string } so UI can show inline errors
// ---------------------------------------------

export function isRequired(value) {
  const valid = value !== null && value !== undefined && String(value).trim().length > 0;
  return { valid, message: valid ? '' : 'This field is required.' };
}

export function isEmail(value) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid = pattern.test(String(value).trim());
  return { valid, message: valid ? '' : 'Enter a valid email address.' };
}

export function isPhone(value) {
  const pattern = /^[+]?[\d\s()-]{7,20}$/;
  const valid = pattern.test(String(value).trim());
  return { valid, message: valid ? '' : 'Enter a valid phone number.' };
}

export function minLength(value, min) {
  const valid = String(value ?? '').trim().length >= min;
  return { valid, message: valid ? '' : `Must be at least ${min} characters.` };
}

export function maxLength(value, max) {
  const valid = String(value ?? '').trim().length <= max;
  return { valid, message: valid ? '' : `Must be no more than ${max} characters.` };
}

export function isNumberInRange(value, min, max) {
  const num = Number(value);
  const valid = !Number.isNaN(num) && num >= min && num <= max;
  return { valid, message: valid ? '' : `Enter a number between ${min} and ${max}.` };
}

export function matches(value, otherValue, fieldName = 'Fields') {
  const valid = value === otherValue;
  return { valid, message: valid ? '' : `${fieldName} do not match.` };
}

/**
 * Validate a whole form object against a rules map.
 * Usage:
 *   validateForm(
 *     { email: 'a@b.com', message: '' },
 *     { email: [isRequired, isEmail], message: [isRequired, (v) => minLength(v, 10)] }
 *   )
 * Returns { valid: boolean, errors: { fieldName: message } }
 */
export function validateForm(values, rules) {
  const errors = {};
  let valid = true;

  Object.entries(rules).forEach(([field, validators]) => {
    for (const validator of validators) {
      const result = validator(values[field]);
      if (!result.valid) {
        errors[field] = result.message;
        valid = false;
        break; // stop at first failing rule per field
      }
    }
  });

  return { valid, errors };
}