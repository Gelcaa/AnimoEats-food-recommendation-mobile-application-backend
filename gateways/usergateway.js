const prisma = require("../models/prisma/prismaClient");
const Joi = require("joi");
const nutritionCalculations = require("../services/nutritionCalculations");
// const firebase = require("../firebaseConfig");
const dotenv = require("dotenv");
dotenv.config();

// Function to generate 4-digit token
function generate4DigitToken() {
  return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
}

// Validate email with @dlsud.edu.ph domain
function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@dlsud\.edu\.ph$/;
  return regex.test(email);
}

// Configure Nodemailer transporter for sending emails
// const transporter = nodemailer.createTransport({
//   service: "gmail", // or another email service
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// Function to generate 4-digit token
// function generate4DigitToken() {
//   return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
// }

// Validate email with @dlsud.edu.ph domain
function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@dlsud\.edu\.ph$/;
  return regex.test(email);
}

class UserGateway {
  // Create a new user
  static async createUser({ email, password, firstName, lastName }) {
    return await prisma.user.create({
      data: {
        email,
        password,
        firstName,
        lastName,
        createdAt: new Date(),
      },
    });
  }

  // Update or create user profile (height, weight, etc.)
  static async upsertUserTDEE(userId, tdeeData) {
    const tdee = nutritionCalculations.calculateTDEE(
      tdeeData.heightFeet,
      tdeeData.weightKg,
      tdeeData.age,
      tdeeData.gender,
      tdeeData.activityLevel
    );

    return await prisma.userTDEE.upsert({
      where: {
        userId: userId, // `userId` uniquely identifies each user
      },
      update: {
        heightFeet: tdeeData.heightFeet,
        weightKg: tdeeData.weightKg,
        age: tdeeData.age,
        gender: tdeeData.gender,
        activityLevel: tdeeData.activityLevel,
        tdee: tdee, // Update the calculated TDEE
      },
      create: {
        userId: userId, // Creates a new record with a new `tdeeId` and specified `userId`
        heightFeet: tdeeData.heightFeet,
        weightKg: tdeeData.weightKg,
        age: tdeeData.age,
        gender: tdeeData.gender,
        activityLevel: tdeeData.activityLevel,
        calories: calories, // Save the calculated TDEE
      },
    });
  }

  // Function to send 4-digit token via email
  // static async sendTokenEmail(email) {
  //   if (!validateEmail(email)) {
  //     throw new Error("Invalid email domain. Only @dlsud.edu.ph is allowed.");
  //   }

  //   const token = generate4DigitToken();
  //   const mailOptions = {
  //     from: process.env.EMAIL_USER,
  //     to: email,
  //     subject: "Your 4-Digit Verification Code",
  //     text: `Your 4-digit verification token is: ${token}`,
  //   };

  //   try {
  //     // Send the email with the generated token
  //     await transporter.sendMail(mailOptions);

  //     // Store the token temporarily (could be saved in the database with expiration)
  //     await prisma.token.create({
  //       data: {
  //         email: email,
  //         token: token,
  //         expiresAt: new Date(
  //           Date.now() + parseInt(process.env.TOKEN_EXPIRATION_TIME)
  //         ),
  //       },
  //     });

  //     return { message: "Email sent successfully", token };
  //   } catch (error) {
  //     throw new Error("Failed to send verification email");
  //   }
  // }

  // Verify the entered token
  // static async verifyToken(email, enteredToken) {
  //   const tokenRecord = await prisma.token.findUnique({
  //     where: { email: email },
  //   });

  //   if (
  // !tokenRecord ||
  //     tokenRecord.token !== enteredToken ||
  //     new Date() > tokenRecord.expiresAt
  //   ) {
  //     throw new Error("Invalid or expired token");
  //   }

  //   return true; // Token is valid
  // }

  static async userHealthProfile(userId, tdeeData) {
    // Calculate TDEE using the provided data
    const calories = nutritionCalculations.calculateTDEE(
      tdeeData.heightFeet,
      tdeeData.weightKg,
      tdeeData.age,
      tdeeData.gender,
      tdeeData.activityLevel
    );

    const bmi = nutritionCalculations.calculateBMI(
      tdeeData.weightKg,
      tdeeData.heightFeet
    );

    // Adjust calories based on BMI
    const { adjustedCalories, weightGoal } =
      nutritionCalculations.adjustCaloriesBasedOnBMI(bmi, calories);

    const { protein, fat, carbohydrate, fiber, sodium, sugar } =
      nutritionCalculations.calculateUserHealthProfile(tdeeData);

    return await prisma.userHealthProfile.create({
      data: {
        userId: userId,
        heightFeet: tdeeData.heightFeet,
        weightKg: tdeeData.weightKg,
        age: tdeeData.age,
        gender: tdeeData.gender,
        activityLevel: tdeeData.activityLevel,
        bmi: bmi,
        weightGoal: weightGoal,
        calories: adjustedCalories,
        carbohydrate: carbohydrate,
        fat: fat,
        protein: protein,
        fiber: fiber,
        sodium: sodium,
        sugar: sugar,
      },
    });
  }

  static async updateUserHealthProfile(userId, profileData) {
    // Calculate TDEE and BMI using the provided data
    const calories = nutritionCalculations.calculateTDEE(
      profileData.heightFeet,
      profileData.weightKg,
      profileData.age,
      profileData.gender,
      profileData.activityLevel
    );

    const bmi = nutritionCalculations.calculateBMI(
      profileData.weightKg,
      profileData.heightFeet
    );

    // Adjust calories based on BMI and calculate nutrient goals
    const { adjustedCalories, weightGoal } =
      nutritionCalculations.adjustCaloriesBasedOnBMI(bmi, calories);

    const { protein, fat, carbohydrate, fiber, sodium, sugar } =
      nutritionCalculations.calculateUserHealthProfile(profileData);

    // Update existing user health profile data
    return await prisma.userHealthProfile.update({
      where: { userId },
      data: {
        heightFeet: profileData.heightFeet,
        weightKg: profileData.weightKg,
        age: profileData.age,
        gender: profileData.gender,
        activityLevel: profileData.activityLevel,
        bmi,
        weightGoal,
        calories: adjustedCalories,
        carbohydrate,
        fat,
        protein,
        fiber,
        sodium,
        sugar,
      },
    });
  }

  // Update or create user allergens
  static async createAllergies(userId, allergies) {
    return await prisma.userAllergies.create({
      data: {
        userId: userId, // Foreign key referencing User
        egg_free: allergies.egg_free,
        gluten_free: allergies.gluten_free,
        dairy_free: allergies.dairy_free,
        fish_free: allergies.fish_free,
        shellfish_free: allergies.shellfish_free,
        peanut_free: allergies.peanut_free,
        treenut_free: allergies.treenut_free,
        soy_free: allergies.soy_free,
        wheat_free: allergies.wheat_free,
      },
    });
  }

  static async updateAllergies(userId, allergies) {
    return await prisma.userAllergies.update({
      where: { userId: userId },
      data: {
        egg_free: allergies.egg_free,
        gluten_free: allergies.gluten_free,
        dairy_free: allergies.dairy_free,
        fish_free: allergies.fish_free,
        shellfish_free: allergies.shellfish_free,
        peanut_free: allergies.peanut_free,
        treenut_free: allergies.treenut_free,
        soy_free: allergies.soy_free,
        wheat_free: allergies.wheat_free,
      },
    });
  }

  // static async createUserProfile(userId, healthProfileId, allergenId) {
  //   return await prisma.userProfile.create({
  //     data: {
  //       userId: userId, // Create a new user profile with the userId
  //       healthProfileId: healthProfileId, // Associate the new TDEE ID
  //       allergenId: allergenId, // Associate the new Allergen ID
  //     },
  //   });
  // }
}

module.exports = UserGateway;
