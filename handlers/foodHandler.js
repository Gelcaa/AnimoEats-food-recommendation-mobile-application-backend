const FoodGateway = require("../gateways/foodGateway");
// const { validateSwipeHistory } = require("../validations/foodValidation");

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
}

module.exports = FoodHandler;
