const UserGateway = require("../gateways/usergateway");
const {
  validateLogin,
  validateRegister,
  validateTdee,
  // validateAllergies,
} = require("../validations/userValidation");
const { transformUser } = require("../transformers/userTransformer");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

async function verifyPassword(enteredPassword, storedHashedPassword) {
  return await bcrypt.compare(enteredPassword, storedHashedPassword);
}
const prisma = new PrismaClient();

async function loginUser(data) {
  try {
    // Check if the user exists
    const validation = validateLogin(data);
    if (!validation.isValid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: validation.errors }),
      };
    }
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        UserHealthProfile: true,
        UserAllergies: true,
        FoodSwipeHistory: true,
      },
    });

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "User not found. Please check your email and try again.",
        }),
      };
    }

    // Verify the password
    const isPasswordValid = await verifyPassword(data.password, user.password);
    if (!isPasswordValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: "Invalid password. Please try again.",
        }),
      };
    }

    // Check if the user has a health profile
    // Check if the user has a health profile
    const userHealthProfile = user.UserHealthProfile[0];
    if (!userHealthProfile) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message:
            "Login successful, but please complete your health profile first.",
          userId: user.userId,
          verify: user.verified,
          requiresCompletion: true,
        }),
      };
    }

    // Check if the user has FoodSwipeHistory
    const foodSwipeHistory = user.FoodSwipeHistory;

    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0)); // Set to the start of today
    const todayEnd = new Date(today.setHours(23, 59, 59, 999)); // Set to the end of today

    // Check if any food swipe is from today
    const swipedToday = foodSwipeHistory.some((swipe) => {
      const swipeDate = new Date(swipe.swipeDate);
      return swipeDate >= todayStart && swipeDate <= todayEnd;
    });

    if (!foodSwipeHistory || foodSwipeHistory.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message:
            "Login successful, but please proceed to swipe food items first.",
          userId: user.userId,
          verify: user.verified,
          requiresSwipeCompletion: true,
        }),
      };
    }

    if (!swipedToday) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Login successful, but please swipe food items today.",
          userId: user.userId,
          verify: user.verified,
          requiresSwipeCompletion: true,
        }),
      };
    }

    // If all checks pass
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Login successful",
        userId: user.userId,
        verify: user.verified,
        requiresRegisterCompletion: false,
        requiresSwipeCompletion: false,
      }),
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An error occurred while logging in. Please try again.",
      }),
    };
  }
}

// Register a new user
async function registerUser(data) {
  try {
    const validation = validateRegister(data);
    if (!validation.isValid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: validation.errors }),
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Email is already in use. Please choose a different email.",
        }),
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = { ...data, password: hashedPassword };
    const user = await UserGateway.createUser(userData);
    console.log(user);
    return {
      statusCode: 201,
      body: JSON.stringify(transformUser(user)),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

async function verifyRegistration(data) {
  const { email, otp } = data; // Destructure email and otp from request data

  try {
    // Call the verifyOTP method in your gateway
    const result = await UserGateway.verifyOTP({ email, otp });

    // Format the success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: result.message }),
    };
  } catch (error) {
    console.error("Error in verifyRegistration:", error);

    // Format the error response
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: error.message || "Failed to verify OTP",
      }),
    };
  }
}

// Change Password Handler
async function changePassword(data) {
  const { userId, oldPassword, newPassword } = data; // Destructure the necessary fields from data
  try {
    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { userId: userId },
    });

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    // Verify the old password with the stored hashed password
    const isPasswordValid = await verifyPassword(oldPassword, user.password);

    if (!isPasswordValid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Old password is incorrect" }),
      };
    }

    // Hash the new password before updating
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    const updatedUser = await prisma.user.update({
      where: { userId: userId },
      data: { password: hashedNewPassword },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Password changed successfully" }),
    };
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
}

async function verifyPassword(enteredPassword, storedHashedPassword) {
  return await bcrypt.compare(enteredPassword, storedHashedPassword);
}

module.exports = { changePassword };

async function resendOTP(email) {
  try {
    const otp = await UserGateway.generateAndSendOTP(email);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "A new OTP has been sent to your email.",
      }),
    };
  } catch (error) {
    console.error("Error in resendOTP:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to resend OTP." }),
    };
  }
}

// Update allergens
async function updateAllergies(data) {
  try {
    const updateAllergiesData = {
      egg_free: data.egg_free,
      gluten_free: data.gluten_free,
      dairy_free: data.dairy_free,
      fish_free: data.fish_free,
      shellfish_free: data.shellfish_free,
      peanut_free: data.peanut_free,
      treenut_free: data.treenut_free,
      soy_free: data.soy_free,
      wheat_free: data.wheat_free,
    };

    const userAllergies = await UserGateway.updateAllergies(
      data.user.id,
      updateAllergiesData
    );
    return {
      statusCode: 200,
      body: JSON.stringify(userAllergies),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

async function updateUserHealthProfile(data) {
  try {
    const updateUserHealthProfileData = {
      heightFeet: data.heightFeet,
      weightKg: data.weightKg,
      age: data.age,
      activityLevel: data.activityLevel,
    };

    const updatedProfile = await UserGateway.updateUserHealthProfile(
      data.user.id,
      updateUserHealthProfileData
    );

    const updatedUserNames = await UserGateway.updateUserName(data.user.id, {
      firstName: data.firstName,
      lastName: data.lastName,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(updatedProfile),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

async function completeRegistration(data) {
  try {
    const tdeeValidation = validateTdee(data);
    if (!tdeeValidation.isValid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: tdeeValidation.errors }),
      };
    }

    const healthProfileData = {
      heightFeet: data.heightFeet,
      weightKg: data.weightKg,
      age: data.age,
      gender: data.gender,
      activityLevel: data.activityLevel,
    };

    // Upsert user TDEE
    const userHealthProfile = await UserGateway.userHealthProfile(
      data.user.id,
      healthProfileData
    );

    const allergiesData = {
      egg_free: data.egg_free,
      gluten_free: data.gluten_free,
      dairy_free: data.dairy_free,
      fish_free: data.fish_free,
      shellfish_free: data.shellfish_free,
      peanut_free: data.peanut_free,
      treenut_free: data.treenut_free,
      soy_free: data.soy_free,
      wheat_free: data.wheat_free,
    };

    const userAllergies = await UserGateway.createAllergies(
      data.user.id,
      allergiesData
    );

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Registration complete",
        userId: data.userId,
        userHealthProfile,
        userAllergies,
      }),
    };
  } catch (error) {
    console.error("Error during complete registration:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

async function getUserFoodRecommendations(userId) {
  try {
    // Fetching the 6 latest food recommendations for the user
    const foodRecommendations = await prisma.userFoodRecommendations.findMany({
      where: {
        userId: userId,
      },
      orderBy: [
        { recommendedAt: "desc" }, // First order by the latest recommendation
        { rank: "asc" }, // Then order by rank (1 - 6)
      ],
      take: 20, // Limiting to the 6 latest recommendations
      include: {
        foodDetail: true, // Including the food details associated with the recommendation
      },
    });

    if (!foodRecommendations || foodRecommendations.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "No food recommendations found for this user",
        }),
      };
    }

    // Mapping the response to include only necessary fields
    const foodData = foodRecommendations.map((recommendation) => ({
      rank: recommendation.rank,
      foodId: recommendation.foodDetail.id,
      categoryId: recommendation.foodDetail.categoryId,
      foodName: recommendation.foodDetail.foodName,
      imageUrl: recommendation.foodDetail.imageUrl,
      stallName: recommendation.foodDetail.stallName,
      price: recommendation.foodDetail.price,
      calories: recommendation.foodDetail.calories,
      protein: recommendation.foodDetail.protein,
      carbohydrates: recommendation.foodDetail.carbohydrates,
      fat: recommendation.foodDetail.fat,
      fiber: recommendation.foodDetail.fiber,
      sodium: recommendation.foodDetail.sodium,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        foodRecommendations: foodData,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
}

async function getUserHealthProfile(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: userId,
      },
    });

    const userHealthProfile = await prisma.userHealthProfile.findUnique({
      where: {
        userId: userId,
      },
    });

    const userAllergies = await prisma.userAllergies.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!userHealthProfile || !userAllergies) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "User health profile or allergies not found",
        }),
      };
    }

    const filteredAllergies = {};
    Object.keys(userAllergies).forEach((allergy) => {
      if (userAllergies[allergy] === 1) {
        filteredAllergies[allergy] = 1;
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        user: {
          firstName: user.firstName,
        },
        userHealthProfile: {
          healthProfileId: userHealthProfile.healthProfileId,
          userId: userHealthProfile.userId,
          weightKg: userHealthProfile.weightKg,
          heightFeet: userHealthProfile.heightFeet,
          age: userHealthProfile.age,
          gender: userHealthProfile.gender,
          activityLevel: userHealthProfile.activityLevel,
          bmi: userHealthProfile.bmi,
          weightGoal: userHealthProfile.weightGoal,
          calories: userHealthProfile.calories,
          carbohydrate: userHealthProfile.carbohydrate,
          fat: userHealthProfile.fat,
          protein: userHealthProfile.protein,
          fiber: userHealthProfile.fiber,
          sodium: userHealthProfile.sodium,
          sugar: userHealthProfile.sugar,
        },
        userAllergies: filteredAllergies,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
}

async function getUserAllergies(userId) {
  try {
    const userAllergies = await prisma.userAllergies.findUnique({
      where: {
        userId: userId,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        egg_free: userAllergies.egg_free,
        gluten_free: userAllergies.gluten_free,
        dairy_free: userAllergies.dairy_free,
        fish_free: userAllergies.fish_free,
        shellfish_free: userAllergies.shellfish_free,
        peanut_free: userAllergies.peanut_free,
        treenut_free: userAllergies.treenut_free,
        soy_free: userAllergies.soy_free,
        wheat_free: userAllergies.wheat_free,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
}

async function getUserDetails(userId) {
  try {
    // Fetch user details from the database (User model and related UserHealthProfile)
    const userDetails = await prisma.user.findUnique({
      where: { userId: Number(userId) },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        UserHealthProfile: {
          select: {
            weightKg: true,
            heightFeet: true,
            age: true,
            activityLevel: true,
          },
        },
      },
    });

    // Check if user exists
    if (
      !userDetails ||
      !userDetails.UserHealthProfile ||
      userDetails.UserHealthProfile.length === 0
    ) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User or health profile not found" }),
      };
    }

    // Extract health profile details
    const { firstName, lastName, email } = userDetails;
    const { weightKg, heightFeet, age, activityLevel } =
      userDetails.UserHealthProfile[0];

    // Return the user details in the required format
    return {
      statusCode: 200,
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        heightFeet: heightFeet,
        weightKg: weightKg,
        age: age,
        activityLevel: activityLevel,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
}

module.exports = {
  loginUser,
  registerUser,
  changePassword,
  updateAllergies,
  updateUserHealthProfile,
  updateAllergies,
  verifyRegistration,
  resendOTP,
  completeRegistration,
  getUserHealthProfile,
  getUserFoodRecommendations,
  getUserAllergies,
  getUserDetails,
};
