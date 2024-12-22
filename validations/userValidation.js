function validateLogin(data) {
  const errors = [];

  // Check for required fields
  if (!data.email) errors.push("Email is required");
  if (!data.password) errors.push("Password is required");

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email)) {
    errors.push("Invalid email format");
  }

  return { isValid: errors.length === 0, errors };
}

function validateRegister(data) {
  const errors = [];

  // Check for required fields
  if (!data.email) errors.push("Email is required");
  if (!data.password) errors.push("Password is required");
  if (!data.firstName) errors.push("First name is required");
  if (!data.lastName) errors.push("Last name is required");

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email)) {
    errors.push("Invalid email format");
  }
  

  // Validate password length
  if (data.password && data.password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  return { isValid: errors.length === 0, errors };
}

function validateTdee(data) {
  console.log("Validating profile data:", JSON.stringify(data, null, 2));
  const errors = [];

  if (!data.heightFeet) errors.push("Height is required");
  if (!data.weightKg) errors.push("Weight is required");
  if (!data.age) errors.push("Age is required");
  if (!data.gender) errors.push("Gender is required");

  if (data.heightFeet <= 0) {
    errors.push("Height must be a positive number");
  }

  if (data.weightKg <= 0) {
    errors.push("Weight must be a positive number");
  }

  if (data.age < 0 || data.age > 120) {
    errors.push("Age must be a valid number between 0 and 120");
  }

  const validGenders = ["male", "female"];
  if (data.gender && !validGenders.includes(data.gender.toLowerCase())) {
    errors.push("Gender must be one of the following: male, female");
  }

  return { isValid: errors.length === 0, errors };
}

function validateAllergies(data) {
  if (!data) {
    errors.push("Allergies data is required.");
    return { isValid: false, errors };
  }

  const allergyFields = [
    "egg_free",
    "gluten_free",
    "dairy_free",
    "fish_free",
    "shellfish_free",
    "peanut_free",
    "treenut_free",
    "soy_free",
    "wheat_free",
  ];

  allergyFields.forEach((field) => {
    const value = data[field];
    if (value !== 0 && value !== 1) {
      errors.push(
        `The field '${field}' must be either 0 (not allergic) or 1 (allergic).`
      );
    }
  });

  return { isValid: errors.length === 0, errors };
}

module.exports = {
  validateLogin,
  validateRegister,
  validateTdee,
  validateAllergies,
};
