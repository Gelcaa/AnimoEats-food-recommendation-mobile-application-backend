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
        UserHealthProfile: true, // Include UserHealthProfile for the user
        UserAllergies: true,
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
    const userHealthProfile = user.UserHealthProfile[0];
    if (userHealthProfile) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Login successful! You are fully registered.",
          userId: user.userId,
          requiresRegisterCompletion: false,
        }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Login successful, but please complete your information.",
          userId: user.userId,
          requiresCompletion: true, // Indicate that registration is incomplete
        }),
      };
    }
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

    // await UserGateway.createUserProfile(
    //   data.user.id,
    //   userHealthProfile.healthProfileId,
    //   userAllergies.allergenId
    // );
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
async function getUserHealthProfile(userId) {
  try {
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
    const { firstName, lastName } = userDetails;
    const { weightKg, heightFeet, age, activityLevel } =
      userDetails.UserHealthProfile[0];

    // Return the user details in the required format
    return {
      statusCode: 200,
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
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
  updateAllergies,
  updateUserHealthProfile,
  updateAllergies,
  completeRegistration,
  getUserHealthProfile,
  getUserAllergies,
  getUserDetails,
};
