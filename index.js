const express = require("express");
const userHandler = require("../animoeats-food-recommendor/handlers/userHandler");
const foodHandler = require("../animoeats-food-recommendor/handlers/foodHandler");
const app = express();
const cors = require("cors");
const port = 3000;
const dotenv = require("dotenv");

dotenv.config();

const corsOptions = {
  origin: 'http://10.0.2.2:3000', // or your frontend URL
  methods: ['GET', 'POST', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(cors());
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

app.put("/dev/user/tdee", async (req, res) => {
  const data = req.body;
  try {
    const response = await userHandler.updateUserProfile(data);
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

// Food Routes
app.post("/dev/foodCategory/create", async (req, res) => {
  const data = req.body;
  try {
    const response = await foodHandler.createFoodCategory(data);
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
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
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

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
