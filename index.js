const functions = require("firebase-functions/v2");

const express = require("express");
const userHandler = require("./handlers/userHandler");
const foodHandler = require("./handlers/foodHandler");
const port = 3000;
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
app.use(cors({ origin: true }));
app.use(express.json());

// User Routes
app.post("/dev/user/login", async (req, res) => {
  const data = req.body;
  try {
    const response = await userHandler.loginUser(data);
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/dev/user/register", async (req, res) => {
  const data = req.body;
  try {
    const response = await userHandler.registerUser(data);
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.patch("/dev/user/change-password", async (req, res) => {
  const data = req.body;
  try {
    const response = await userHandler.changePassword(data);
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.patch("/dev/user/update/profile", async (req, res) => {
  const data = req.body;
  try {
    const response = await userHandler.updateUserHealthProfile(data);
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/dev/user/update/allergies", async (req, res) => {
  const data = req.body;
  try {
    const response = await userHandler.updateAllergies(data);
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/dev/user/register/complete", async (req, res) => {
  const data = req.body;
  try {
    const response = await userHandler.completeRegistration(data);
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/dev/user/register/complete", async (req, res) => {
  const data = req.body;
  try {
    const response = await userHandler.completeRegistration(data);
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/dev/user/register/verify", async (req, res) => {
  const data = req.body; // Contains email and OTP entered by the user
  try {
    const response = await userHandler.verifyRegistration(data);
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/dev/user/register/verify", async (req, res) => {
  const data = req.body; // Contains email and OTP entered by the user
  try {
    const response = await userHandler.verifyRegistration(data);
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/dev/user/register/resend-otp", async (req, res) => {
  const { email } = req.body;
  try {
    const response = await userHandler.resendOTP(email);
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Other User Info Routes
app.get("/dev/user/:userId/health-profile", async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const response = await userHandler.getUserHealthProfile(userId);
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/dev/user/:userId/food-recommendations", async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const response = await userHandler.getUserFoodRecommendations(userId);
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/dev/user/food-choices", async (req, res) => {
  const data = req.body; // Contains userId, foodItemId, preference, and categoryId
  try {
    const response = await foodHandler.createFoodChoice(data);
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/dev/user/food-choices/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const response = await foodHandler.getFoodChoicesByDay(
      Number(userId),
    );
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/dev/user/:userId/allergies", async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const response = await userHandler.getUserAllergies(userId);
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/dev/user/:userId/details", async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const response = await userHandler.getUserDetails(userId);
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/dev/food/:userId/available", async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const response = await foodHandler.getAvailableFoodItems(userId);
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    console.error("Error details:", error); // Logs detailed error information to the console for debugging

    // Send detailed error in the response
    const errorResponse = {
      message: "Internal Server Error",
      error: error.message || "Unknown error",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined, // Include stack trace only in development
    };

    res.status(500).json(errorResponse);
  }
});

app.post("/dev/food/swipes", async (req, res) => {
  const { userId, swipes } = req.body; // Assuming `userId` is passed in the request body
  try {
    const response = await foodHandler.createFoodSwipeHistories({
      userId,
      swipes,
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

exports.app = functions.https.onRequest(app);
