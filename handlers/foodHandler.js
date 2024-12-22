const FoodGateway = require("../gateways/foodGateway");
// const { validateSwipeHistory } = require("../validations/foodValidation");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class FoodHandler {
  // Create a swipe history record for a user
  static async createFoodSwipeHistories({ userId, swipes }) {
    try {
      await FoodGateway.createFoodSwipeHistories({ userId, swipes });
      return {
        statusCode: 201,
        body: JSON.stringify({ message: "Swipes recorded successfully" }),
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal Server Error" }),
      };
    }
  }

  // Fetch the available food items for a user
  static async getAvailableFoodItems(userId) {
    try {
      const foodItems = await FoodGateway.getAvailableFoodItems(userId);
      return {
        statusCode: 200,
        body: JSON.stringify(foodItems),
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal Server Error" }),
      };
    }
  }

  static async createFoodChoice(data) {
    try {
      const foodChoice = await FoodGateway.createFoodChoiceInDb(data);
      console.log("Raw foodChoice data:", foodChoice);
      return {
        statusCode: 201,
        body: JSON.stringify(foodChoice),
      };
    } catch (error) {
      console.error("Error in createFoodChoice:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to create food choice" }),
      };
    }
  }

  static async getFoodChoicesByDay(userId, date) {
    try {
      const foodChoices = await prisma.userFoodChoice.findMany({
        where: {
          userId: userId,
        },
        include: {
          foodItem: true,
        },
      });

      if (foodChoices.length === 0) {
        console.log("No food choices found for the specified date.");
        return {
          statusCode: 404,
          body: JSON.stringify({
            message: "No food choices found for the specified date.",
          }),
        };
      }

      console.log(`Food choices retrieved for ${date}:`, foodChoices);
      return {
        statusCode: 200,
        body: JSON.stringify(foodChoices),
      };
    } catch (error) {
      console.error("Error retrieving food choices by day:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to retrieve food choices." }),
      };
    }
  }
}

module.exports = FoodHandler;
