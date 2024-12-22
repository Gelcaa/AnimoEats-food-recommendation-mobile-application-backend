const prisma = require("../prisma/prismaClient");
const Joi = require("joi");
const nutritionCalculations = require("../services/nutritionCalculations");
const dotenv = require("dotenv");
dotenv.config();
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class UserGateway {
  static generateOTP() {
    return crypto.randomInt(1000, 10000); // Generate a random 4-digit OTP
  }

  // Configure Nodemailer transporter with Gmail (or other SMTP provider)
  // static transporter = nodemailer.createTransport({
  //   service: "gmail", // Replace with your SMTP provider if needed
  //   auth: {
  //     user: process.env.GMAIL_USER, // Your email account (Gmail)
  //     pass: process.env.GMAIL_PASS, // Your Gmail app password
  //   },
  // });

  // Function to send OTP email
  static async sendOTPEmail(userEmail, otp) {
    const msg = {
      to: userEmail, // Recipient's email
      from: process.env.SENDGRID_VERIFIED_EMAIL, // Your verified sender email
      subject: "Your OTP for Verification - ANIMOEATS",
      text: `Your 4-digit OTP is: ${otp}. If you did not request this OTP, please disregard this message.`, // Email body
    };

    try {
      await sgMail.send(msg);
      console.log("OTP email sent successfully to: " + userEmail);
      console.log(`Generated OTP: ${otp}`);
      return otp; // Return OTP for further use (to store or verify)
    } catch (error) {
      console.error("Error sending OTP email: ", error);
      throw new Error("Failed to send OTP email.");
    }
  }
  static async createUser({ email, password, firstName, lastName }) {
    try {
      const user = await prisma.user.create({
        data: {
          email,
          password,
          firstName,
          lastName,
          verified: false,
          createdAt: new Date(),
        },
      });
      const otp = this.generateOTP();
      const expiry = new Date(Date.now() + 15 * 60 * 1000); // OTP expires in 15 minutes

      // Remove any existing OTPs for this email
      await prisma.userAuthCode.deleteMany({ where: { email } });

      await prisma.userAuthCode.create({
        data: {
          email,
          code: otp.toString(),
          expiresAt: expiry,
        },
      });

      // Send OTP email
      await this.sendOTPEmail(email, otp);

      return {
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Error creating user.");
    }
  }

  static async verifyOTP({ email, otp }) {
    try {
      // Retrieve OTP record
      const otpRecord = await prisma.userAuthCode.findFirst({
        where: { email },
      });

      if (!otpRecord) {
        throw new Error("No OTP found for this email.");
      }

      if (otpRecord.code !== otp) {
        throw new Error("Invalid OTP.");
      }

      if (new Date() > otpRecord.expiresAt) {
        throw new Error("OTP expired. Please request a new one.");
      }

      // Mark user as verified
      await prisma.user.update({
        where: { email },
        data: { verified: true },
      });

      // Delete the OTP record to prevent reuse
      await prisma.userAuthCode.delete({ where: { email } });

      return { message: "User verified successfully." };
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  }

  static async generateAndSendOTP(email) {
    const otp = this.generateOTP();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // New 15-minute expiration

    await prisma.userAuthCode.upsert({
      where: { email },
      update: { code: otp.toString(), expiresAt: expiry },
      create: { email, code: otp.toString(), expiresAt: expiry },
    });

    await this.sendOTPEmail(email, otp);

    return otp;
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
        userId: userId,
        heightFeet: tdeeData.heightFeet,
        weightKg: tdeeData.weightKg,
        age: tdeeData.age,
        gender: tdeeData.gender,
        activityLevel: tdeeData.activityLevel,
        calories: calories, // Save the calculated TDEE
      },
    });
  }

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
  static async updateUserName(userId, nameData) {
    return await prisma.user.update({
      where: { userId },
      data: {
        firstName: nameData.firstName,
        lastName: nameData.lastName,
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
}

module.exports = UserGateway;
