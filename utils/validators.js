export function validateProduct(data) {
  const errors = {};
  if (!data.name || data.name.length < 3) errors.name = 'Name must be at least 3 characters.';
  if (data.price == null || isNaN(data.price) || data.price <= 0) errors.price = 'Price must be a positive number.';
  return { valid: Object.keys(errors).length === 0, errors };
}